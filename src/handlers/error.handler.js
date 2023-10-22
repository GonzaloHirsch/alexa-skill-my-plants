const Alexa = require('ask-sdk-core');
const util = require('util');
const locale = require('../locales/en-GB');
const constants = require('../utils/constants');

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(`Error handled: ${error.message}`);
    // Inspect the request to be able to debug for errors.
    console.error(
      util.inspect(handlerInput.requestEnvelope, true, null, false)
    );

    // Determine the response based on the intent name
    const response = constants.ALL_INTENTS.includes(
      Alexa.getIntentName(handlerInput.requestEnvelope)
    )
      ? locale.ERROR.UNKNOWN
      : locale.ERROR.NO_UNDERSTAND;

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt(response)
      .getResponse();
  }
};

module.exports = ErrorHandler;
