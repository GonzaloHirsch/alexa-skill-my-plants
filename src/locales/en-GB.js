module.exports = {
  LAUNCH: ['Welcome to your plants! What do you want to know?'],
  RELAUNCH: ['What do you want to know?'],
  HELP: 'You can register a plant, ask when to water your plant next, mark a plant as watered, and many more!',
  HELP_AGAIN:
    'Remember you can add a new plant, ask when to water your plant next, mark a plant as watered, and many more!',
  GOODBYE: 'Goodbye! Take care of your plants!',
  PLANTS: {
    LIST: (amount, list) =>
      `You have ${amount} ${amount === 1 ? 'plant' : 'plants'}.` +
      (amount > 0
        ? ` The ${amount === 1 ? 'name is ' : 'names are '}${list}.`
        : ''),
    CREATED: (plantName, waterSchedule) =>
      `I created a new plant called ${plantName}. You should water it once or every ${waterSchedule}.`,
    DELETED: (plantName) => `I deleted the plant called ${plantName}.`,
    WATERED: (plantName) =>
      `I marked the plant ${plantName} as watered just now.`,
    UPDATED: (plantName, waterSchedule) =>
      `I updated the watering schedule for ${plantName} to be once or every ${waterSchedule}.`,
    LAST_WATERED: (plantName, hasWatered, lastWater) =>
      hasWatered
        ? `Looks like you watered ${plantName} roughly ${lastWater} ago.`
        : `It seems like you haven't watered ${plantName}.`,
    DELETED_NO_EXIST: (plantName) =>
      `I couldn't delete the plant called ${plantName} because it doesn't exist.`,
    WATER_TODAY: (amount, list) =>
      // eslint-disable-next-line prettier/prettier
      amount > 0 ? `You need to water ${amount} ${amount === 1 ? 'plant' : 'plants'} today! The ${amount === 1 ? 'name is' : 'names are'} ${list}.`
        : `You don't have to water your plants today!`
  },
  CONFIRMATION: {
    ACCEPT: [
      'for sure',
      'absolutely',
      'yes',
      'you know it',
      'yes please',
      'sure',
      'i do',
      'yeah',
      'yup'
    ],
    DECLINE: [
      'not sure',
      "i don't know",
      'no thank you',
      'i do not',
      'nope',
      'no'
    ]
  },
  ERROR: {
    UNKNOWN: 'Uh Oh. Looks like something went wrong.',
    NO_UNDERSTAND:
      "Sorry, I don't understand your command. Please say it again.",
    NO_PLANT_NAME: 'Sorry, I need a plant name. Please say it again.',
    NO_WATER_SCHEDULE:
      'Sorry, I need a schedule to water that plant. Please try again later.',
    NO_PLANTS:
      "Sorry, you haven't registered any plants. Maybe try registering one?",
    NO_DELETE_CONFIRMATION: (name) =>
      `Ok, I will not delete the plant called ${name}.`,
    DUPLICATE_PLANT_NAME: (name) =>
      `Sorry, it seems like you already have registered a plant called ${name}. You can create another with a different name.`,
    INVALID_PLANT_NAME: (name) =>
      `Ops! Looks like the plant ${name} doesn't exist. Are you sure it's the right name?`
  }
};
