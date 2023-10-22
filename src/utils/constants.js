// Exports some constants and abstracts them from the environment variables as well.
module.exports = {
  STORAGE: {
    TABLE_NAME: process.env.DYNAMO_TABLE,
    REGION: process.env.DYNAMO_REGION
  },
  SLOTS: {
    PLANT_NAME: 'plantName',
    WATER_SCHEDULE: 'waterSchedule',
    CONFIRMATION: 'confirmation'
  },
  ALL_INTENTS: [
    'CheckWaterSpecificPlantIntent',
    'CreatePlantIntent',
    'DeletePlantIntent',
    'ListPlantsIntent',
    'WaterPlantIntent',
    'CheckWaterPlantsTodayIntent',
    'UpdatePlantScheduleIntent'
  ]
};
