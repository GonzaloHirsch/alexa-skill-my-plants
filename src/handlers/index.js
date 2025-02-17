const CancelAndStopIntentHandler = require('./cancelAndStop.handler');
const ErrorHandler = require('./error.handler');
const HelpIntentHandler = require('./help.handler');
const LaunchRequestHandler = require('./launch.handler');
const SessionEndedRequestHandler = require('./sessionEnded.handler');
// Custom handlers
const AskListPlantsIntentHandler = require('./listPlants.handler');
const AskCreatePlantIntentHandler = require('./createPlant.handler');
const AskDeletePlantIntentHandler = require('./deletePlant.handler');
const AskWaterPlantIntentHandler = require('./waterPlant.handler');
const AskWaterAllPlantsIntentHandler = require('./waterAllPlants.handler');
const AskCheckWaterSpecificPlantIntentHandler = require('./checkWaterSpecificPlant.handler');
const AskCheckWaterPlantsTodayIntentHandler = require('./checkWaterPlantsToday.handler');
const AskUpdatePlantScheduleIntentHandler = require('./updatePlantSchedule.handler');

module.exports = {
  CancelAndStopIntentHandler,
  ErrorHandler,
  HelpIntentHandler,
  LaunchRequestHandler,
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
};
