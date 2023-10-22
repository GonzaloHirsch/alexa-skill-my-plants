const Alexa = require('ask-sdk-core');
const { deletePlant } = require('../utils/plantsClient');
const util = require('util');
const locale = require('../locales/en-GB');
const constants = require('../utils/constants');

const AskDeletePlantIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'DeletePlantIntent'
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

    const confirmation = Alexa.getSlotValue(
      handlerInput.requestEnvelope,
      constants.SLOTS.CONFIRMATION
    );
    if (!confirmation) {
      return handlerInput.responseBuilder
        .addElicitSlotDirective(constants.SLOTS.CONFIRMATION)
        .getResponse();
    }

    // Ensure the user has confirmed to the deletion
    if (!locale.CONFIRMATION.ACCEPT.includes(confirmation)) {
      // Return the error with a reprompt for the user
      return handlerInput.responseBuilder
        .speak(locale.ERROR.NO_DELETE_CONFIRMATION(plantName))
        .reprompt(locale.ERROR.NO_DELETE_CONFIRMATION(plantName))
        .withShouldEndSession(!sessionAttributes.keepSessionOpen)
        .getResponse();
    }

    // Get all the plants for the user
    try {
      const plantDeleteResponse = await deletePlant(userId, plantName);
      console.debug(plantDeleteResponse);
    } catch (error) {
      // Logging the error
      console.debug(
        `Error deleting a plant with the following data: ${util.inspect({
          userId: userId,
          plantName: plantName
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
    const speechText = locale.PLANTS.DELETED(plantName);
    const cardText = speechText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(!sessionAttributes.keepSessionOpen)
      .getResponse();
  }
};

module.exports = AskDeletePlantIntentHandler;
