const Alexa = require('ask-sdk-core');
const { listAllPlants } = require('../utils/plantsClient');
const { preparePlantList } = require('../utils/responses');
const util = require('util');

const AskListPlantsIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListPlantsIntent'
    );
  },
  async handle(handlerInput) {
    // Debug printing the request just in case
    console.debug(
      util.inspect(handlerInput.requestEnvelope, true, null, false)
    );

    // Need user ID to list all the plants.
    // User ID should always be present, so no need to check for it.
    const userId = Alexa.getUserId(handlerInput.requestEnvelope);

    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();

    // Get all the plants for the user
    const plantsListResponse = await listAllPlants(
      userId,
      'UserId, PlantName, SpeakableName, LastWater'
    );
    console.debug(plantsListResponse);

    const speechText = preparePlantList(
      plantsListResponse.Items.map((elem) => elem.SpeakableName)
    );
    const cardText = speechText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(!sessionAttributes.keepSessionOpen)
      .getResponse();
  }
};

module.exports = AskListPlantsIntentHandler;
