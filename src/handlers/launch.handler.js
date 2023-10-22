const Alexa = require('ask-sdk-core');
const locale = require('../locales/en-GB');
const util = require('util');
const { getRandom } = require('../utils/utils');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    console.debug(
      util.inspect(handlerInput.requestEnvelope, true, null, false)
    );
    const speechText = locale.LAUNCH[getRandom(0, locale.LAUNCH.length)];
    const cardText = locale.RELAUNCH[getRandom(0, locale.RELAUNCH.length)];

    // Store as session opened
    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.keepSessionOpen = true;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(cardText, speechText)
      .withShouldEndSession(false)
      .getResponse();
  }
};

module.exports = LaunchRequestHandler;
