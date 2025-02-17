const Alexa = require('ask-sdk-core');
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  ErrorHandler,
  // Custom intents
  AskListPlantsIntentHandler,
  AskCreatePlantIntentHandler,
  AskDeletePlantIntentHandler,
  AskWaterPlantIntentHandler,
  AskWaterAllPlantsIntentHandler,
  AskCheckWaterSpecificPlantIntentHandler,
  AskCheckWaterPlantsTodayIntentHandler,
  AskUpdatePlantScheduleIntentHandler
} = require('./handlers');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    // Custom handlers
    AskListPlantsIntentHandler,
    AskCreatePlantIntentHandler,
    AskDeletePlantIntentHandler,
    AskWaterPlantIntentHandler,
    AskWaterAllPlantsIntentHandler,
    AskCheckWaterSpecificPlantIntentHandler,
    AskCheckWaterPlantsTodayIntentHandler,
    AskUpdatePlantScheduleIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
