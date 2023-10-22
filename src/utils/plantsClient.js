const constants = require('./constants');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
  DynamoDBDocumentClient
} = require('@aws-sdk/lib-dynamodb');
const { standardizeName } = require('./utils');

// Variable for lazy initialization.
let client;
let docClient;

/**
 * Performs a lazy initialization of the client. If the client is already created, just use it.
 */
const createClient = () => {
  if (!client) {
    client = new DynamoDBClient({ region: constants.STORAGE.REGION });
    docClient = DynamoDBDocumentClient.from(client);
  }
};

/**
 * Lists all plants under a given user.
 * @param {string} userId for the user asking for plants.
 * @param {string} projection to apply to the response (for optimised queries). Default is `''`.
 * @returns a list of plants only containing the projected fields (or all of them).
 */
const listAllPlants = async (userId, projection = 'UserId, PlantName') => {
  createClient();
  const command = new QueryCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    KeyConditionExpression: 'UserId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ProjectionExpression: projection,
    ConsistentRead: true
  });
  const response = await docClient.send(command);
  return response;
};

/**
 * Gets a specific plant for a given user.
 * @param {string} userId for the user asking for a plant.
 * @param {string} plantName for the plant being asked.
 * @param {string} projection to apply to the response (for optimised queries). Default is `''`.
 * @returns plant item response.
 */
const getPlant = async (
  userId,
  plantName,
  projection = 'UserId, PlantName'
) => {
  createClient();
  const command = new GetCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    Key: {
      UserId: userId,
      PlantName: standardizeName(plantName)
    },
    ProjectionExpression: projection,
    ConsistentRead: true
  });
  const response = await docClient.send(command);
  return response;
};

/**
 * Creates a plant in the database given the user ID and the name of said plant.
 * @param {string} userId for the user registering a plant.
 * @param {string} plantName for the plant to be registered.
 * @param {string} schedule for the plant to be watered.
 * @param {number} lastWater time whent he plant was watered.
 * @returns plant creation response.
 */
const createPlant = async (userId, plantName, schedule, lastWater = 0) => {
  createClient();
  const timestamp = Date.now();
  const command = new PutCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    Item: {
      UserId: userId,
      PlantName: standardizeName(plantName),
      SpeakableName: plantName,
      CreatedAt: timestamp,
      UpdatedAt: timestamp,
      LastWater: lastWater,
      Schedule: schedule
    },
    ConditionExpression:
      'attribute_not_exists(UserId) AND attribute_not_exists(PlantName)'
  });
  const response = await docClient.send(command);
  return response;
};

/**
 * Deletes a plant from the database.
 * @param {string} userId ID of the user deleting the plant.
 * @param {string} plantName for the plant to delete.
 * @returns plant deletion response.
 */
const deletePlant = async (userId, plantName) => {
  createClient();
  const command = new DeleteCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    Key: {
      UserId: userId,
      PlantName: standardizeName(plantName)
    }
  });
  const response = await docClient.send(command);
  return response;
};

/**
 * Marks the plant as watered on a specific timestamp.
 * @param {string} userId for the user watering the plant.
 * @param {string} plantName for the plant in question.
 * @returns item update response. An exception is raised if the UserId + PlantName condition is not met.
 */
const waterPlant = async (userId, plantName) => {
  createClient();
  const timestamp = Date.now();
  console.debug(standardizeName(plantName));
  const command = new UpdateCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    Key: {
      UserId: userId,
      PlantName: standardizeName(plantName)
    },
    // Set the last water to the Water array, update last water
    UpdateExpression: 'SET LastWater = :NewLastWater, UpdatedAt = :UpdatedAt',
    ExpressionAttributeValues: {
      ':NewLastWater': timestamp,
      ':UpdatedAt': timestamp
    },
    // Ensure that the item exists
    ConditionExpression:
      'attribute_exists(UserId) AND attribute_exists(PlantName)',
    ReturnValues: 'UPDATED_NEW'
  });
  const response = await docClient.send(command);
  return response;
};

/**
 * Changes a plant watering schedule for a new one.
 * @param {string} userId for the user to be updated.
 * @param {string} plantName for the plant to be updated.
 * @param {string} newSchedule ISO duration for the watering schedule.
 * @returns item update response. An exception is raised if the UserId + PlantName condition is not met.
 */
const updatePlantSchedule = async (userId, plantName, newSchedule) => {
  createClient();
  console.debug(standardizeName(plantName));
  const command = new UpdateCommand({
    TableName: constants.STORAGE.TABLE_NAME,
    Key: {
      UserId: userId,
      PlantName: standardizeName(plantName)
    },
    // Set the last water to the Water array, update last water
    UpdateExpression: 'SET Schedule = :NewSchedule, UpdatedAt = :UpdatedAt',
    ExpressionAttributeValues: {
      ':UpdatedAt': Date.now(),
      ':NewSchedule': newSchedule
    },
    // Ensure that the item exists
    ConditionExpression:
      'attribute_exists(UserId) AND attribute_exists(PlantName)',
    ReturnValues: 'UPDATED_NEW'
  });
  const response = await docClient.send(command);
  return response;
};

module.exports = {
  listAllPlants,
  createPlant,
  deletePlant,
  waterPlant,
  getPlant,
  updatePlantSchedule
};
