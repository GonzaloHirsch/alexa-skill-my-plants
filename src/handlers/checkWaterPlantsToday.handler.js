const Alexa = require('ask-sdk-core');
const { listAllPlants } = require('../utils/plantsClient');
const util = require('util');
const locale = require('../locales/en-GB');
const { prepareWaterTodayResponse } = require('../utils/responses');
const { getDeviceTimeZone } = require('../utils/alexa');
const moment = require('moment');

const AskCheckWaterPlantsTodayIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      // Eslint breaks with the following line, that's why it's commented out
      // eslint-disable-next-line prettier/prettier
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckWaterPlantsTodayIntent'
    );
  },
  async handle(handlerInput) {
    // Debug printing the request just in case
    console.debug(
      util.inspect(handlerInput.requestEnvelope, true, null, false)
    );
    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();

    // Need user ID to list all the plants.
    // User ID should always be present, so no need to check for it.
    const userId = Alexa.getUserId(handlerInput.requestEnvelope);

    // Get the time zone
    const deviceTimeZoneResponse = await getDeviceTimeZone(handlerInput);
    if (!deviceTimeZoneResponse.success) return deviceTimeZoneResponse.payload;
    const deviceTimeZone = deviceTimeZoneResponse.payload;

    // Get all the plants for the user
    const plantsListResponse = await listAllPlants(
      userId,
      'UserId, PlantName, SpeakableName, LastWater, Schedule'
    );
    console.debug(plantsListResponse);

    // No plants, just return
    if (plantsListResponse.Count === 0) {
      return handlerInput.responseBuilder
        .speak(locale.ERROR.NO_PLANTS)
        .withShouldEndSession(!sessionAttributes.keepSessionOpen)
        .getResponse();
    }

    // Get the day offset
    const ts = Date.now();
    const deviceDate = new Date(
      new Date(ts).toLocaleString('en-US', { timeZone: deviceTimeZone })
    );
    const offset = deviceDate.getTime() - ts;
    console.debug(`User TZ is ${deviceTimeZone}. Offset is ${offset}`);

    // Filter by the ones that will need watering today
    plantsToWater = plantsListResponse.Items.filter((elem) => {
      // Get the schedule as a ms interval
      const waterSchedule = moment.duration(elem.Schedule).asMilliseconds();
      // Find the next minimum date that will comply with this schedule
      const minNextWater = elem.LastWater + offset + waterSchedule;
      // Look for the end of the day to consider it today, account for offset, change is in place
      const today = new Date(ts + offset);
      today.setDate(today.getDate() + 1);
      today.setHours(0, 0, 0, 0);
      const tomorrowTs = today.getTime();
      return tomorrowTs >= minNextWater;
    }).map((elem) => elem.SpeakableName);

    // Get prepared for the response.
    const speechText = prepareWaterTodayResponse(plantsToWater);
    const cardText = speechText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(!sessionAttributes.keepSessionOpen)
      .getResponse();
  }
};

module.exports = AskCheckWaterPlantsTodayIntentHandler;
