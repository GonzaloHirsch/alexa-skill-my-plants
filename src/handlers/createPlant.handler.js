const Alexa = require('ask-sdk-core');
const { createPlant } = require('../utils/plantsClient');
const util = require('util');
const locale = require('../locales/en-GB');
const constants = require('../utils/constants');
const { prepareCreatedPlantResponse } = require('../utils/responses');

const AskCreatePlantIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CreatePlantIntent'
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

    const newWaterSchedule = Alexa.getSlotValue(
      handlerInput.requestEnvelope,
      constants.SLOTS.WATER_SCHEDULE
    );
    if (!newWaterSchedule) {
      return handlerInput.responseBuilder
        .addElicitSlotDirective(constants.SLOTS.WATER_SCHEDULE)
        .getResponse();
    }

    // Get all the plants for the user
    try {
      const plantCreateResponse = await createPlant(
        userId,
        plantName,
        newWaterSchedule
      );
      console.debug(plantCreateResponse);
    } catch (error) {
      // Logging the error
      console.debug(
        `Error creating a new plant with the following data: ${util.inspect({
          userId: userId,
          plantName: plantName,
          newWaterSchedule: newWaterSchedule
        })}`
      );
      console.error(error);

      // Return the error with a reprompt for the user
      return handlerInput.responseBuilder
        .speak(locale.ERROR.DUPLICATE_PLANT_NAME(plantName))
        .withShouldEndSession(!sessionAttributes.keepSessionOpen)
        .getResponse();
    }

    // Get prepared for the response.
    const speechText = prepareCreatedPlantResponse(plantName, newWaterSchedule);
    const cardText = speechText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(!sessionAttributes.keepSessionOpen)
      .getResponse();
  }
};

module.exports = AskCreatePlantIntentHandler;
