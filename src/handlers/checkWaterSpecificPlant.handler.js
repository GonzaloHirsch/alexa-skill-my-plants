const Alexa = require('ask-sdk-core');
const { getPlant } = require('../utils/plantsClient');
const util = require('util');
const locale = require('../locales/en-GB');
const constants = require('../utils/constants');
const { prepareLastWateredPlantResponse } = require('../utils/responses');

const AskCheckWaterSpecificPlantIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      // Eslint breaks with the following line, that's why it's commented out
      // eslint-disable-next-line prettier/prettier
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckWaterSpecificPlantIntent'
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

    // Get the attributes for the request.
    // Reprompting with elicit slot ensures Alexa asks for the missing attribute.
    const plantName = Alexa.getSlotValue(
      handlerInput.requestEnvelope,
      constants.SLOTS.PLANT_NAME
    );
    if (!plantName) {
      return handlerInput.responseBuilder
        .addElicitSlotDirective(constants.SLOTS.PLANT_NAME)
        .getResponse();
    }

    // Get all the plants for the user
    let getPlantResponse;
    try {
      getPlantResponse = await getPlant(
        userId,
        plantName,
        'UserId, PlantName, LastWater'
      );
      console.debug(getPlantResponse);
    } catch (error) {
      // Logging the error
      console.debug(
        `Error getting a plant with the following data: ${util.inspect({
          userId: userId,
          plantName: plantName
        })}`
      );
      console.error(error);

      // Return the error with a reprompt for the user
      return handlerInput.responseBuilder
        .speak(locale.ERROR.INVALID_PLANT_NAME(plantName))
        .withShouldEndSession(!sessionAttributes.keepSessionOpen)
        .getResponse();
    }

    // Get prepared for the response.
    const speechText = prepareLastWateredPlantResponse(
      plantName,
      getPlantResponse.Item.LastWater
    );
    const cardText = speechText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(!sessionAttributes.keepSessionOpen)
      .getResponse();
  }
};

module.exports = AskCheckWaterSpecificPlantIntentHandler;
