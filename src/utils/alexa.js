const locale = require('../locales/en-GB');

/**
 * Wraps building a response that other functions in this file might use.
 * @param {boolean} success if the operation was successful.
 * @param {any} payload to be returned to the called, can be anything.
 * @returns a general response to offer to the caller of this function.
 */
const buildResponse = (success, payload) => {
  return {
    success: success,
    payload: payload
  };
};

/**
 * Obtains a time zone from the device directly.
 * @param {*} handlerInput coming from the Alexa invocation directly.
 * @returns a response based on the `buildResponse` function. It contains `success` and `payload` properties to indicate if the operation was successful or not, and the result of it, respectively.
 */
const getDeviceTimeZone = async (handlerInput) => {
  // Split variables
  const { requestEnvelope, serviceClientFactory, responseBuilder } =
    handlerInput;

  let userTimeZone;
  try {
    // Get a service client for the time zone
    const { deviceId } = requestEnvelope.context.System.device;
    const upsServiceClient = serviceClientFactory.getUpsServiceClient();

    // Actually get the TZ and return it
    userTimeZone = await upsServiceClient.getSystemTimeZone(deviceId);
    return buildResponse(true, userTimeZone);
  } catch (error) {
    if (error.name !== 'ServiceError') {
      console.error(`Error response: ${error.message}`);
      return buildResponse(
        false,
        responseBuilder
          .speak(locale.ERROR.UNKNOWN)
          .reprompt(locale.ERROR.UNKNOWN)
          .withShouldEndSession(true)
          .getResponse()
      );
    }
    throw error;
  }
};

module.exports = {
  getDeviceTimeZone
};
