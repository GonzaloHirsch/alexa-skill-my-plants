const moment = require('moment');
const locale = require('../locales/en-GB');

/**
 * Combines items from a list to make a readable list of things that Alexa will read out loud.
 * @param {Array[any]} list of things to combine.
 * @returns a combined list of things with correct punctuation.
 */
const prepareList = (list) => {
  let s = '';
  for (let i = 0; i < list.length; i++) {
    if (i < list.length - 2) s += `${list[i]}, `;
    else if (i < list.length - 1) s += `${list[i]}`;
    else {
      // eslint-disable-next-line prettier/prettier
      const hasComma = list.length > 2 ? ', ' : ' ';
      s += `${list.length > 1 ? `${hasComma}and ` : ''}${list[i]}`;
    }
  }
  return s;
};

/**
 * Prepares a list of plant objects into a speakable list.
 * @param {list[string]} list of plant objects
 * @returns a string with the phrase for Alexa.
 */
const preparePlantList = (list) => {
  return locale.PLANTS.LIST(list.length, prepareList(list));
};

/**
 * Prepares a phrase for Alexa given the plant name and duration.
 * @param {string} plantName for the plant in question.
 * @param {string} waterSchedule ISO duration for the water schedule.
 * @returns a string with the phrase for Alexa.
 */
const prepareCreatedPlantResponse = (plantName, waterSchedule) => {
  const d = moment.duration(waterSchedule);
  return locale.PLANTS.CREATED(plantName, d.humanize());
};

/**
 * Prepares a phrase for Alexa based on the plant name and the time of last water.
 * @param {string} plantName for the plant in question.
 * @param {number} lastWater timestamp for the last time the plant was watered.
 * @param {string} waterSchedule ISO duration for the water schedule.
 * @returns a string with the phrase for Alexa.
 */
const prepareLastWateredPlantResponse = (
  plantName,
  lastWater,
  waterSchedule
) => {
  // Get a moment.js duration for representation purposes.
  const d = moment.duration(moment(Date.now()).diff(moment(lastWater)));
  const dSchedule = moment.duration(waterSchedule);
  return locale.PLANTS.LAST_WATERED(
    plantName,
    lastWater > 0,
    d.humanize(),
    dSchedule.humanize()
  );
};

/**
 * Prepares a phrase for Alexa given the plant name and duration.
 * @param {string} plantName for the plant in question.
 * @param {string} waterSchedule ISO duration for the water schedule.
 * @returns a string with the phrase for Alexa.
 */
const prepareUpdatedPlantResponse = (plantName, waterSchedule) => {
  // Get a moment.js duration for representation purposes.
  const d = moment.duration(waterSchedule);
  return locale.PLANTS.UPDATED(plantName, d.humanize());
};

/**
 * Prepares a phrase for Alexa given the plant list
 * @param {list} list of plant objects.
 * @returns a string with the phrase for Alexa.
 */
const prepareWaterTodayResponse = (list) => {
  return locale.PLANTS.WATER_TODAY(list.length, prepareList(list));
};

/**
 * Prepares a phrase for Alexa given the plant list
 * @param {list} list of plant objects.
 * @returns a string with the phrase for Alexa.
 */
const prepareWaterAllTodayResponse = (list) => {
  return locale.PLANTS.WATER_ALL(list.length, prepareList(list));
};

module.exports = {
  preparePlantList,
  prepareCreatedPlantResponse,
  prepareLastWateredPlantResponse,
  prepareWaterTodayResponse,
  prepareWaterAllTodayResponse,
  prepareUpdatedPlantResponse
};
