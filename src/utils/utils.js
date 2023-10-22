/**
 * Generates a random number between `min` and `max`.
 * @param {Integer} min limit.
 * @param {Integer} max limit.
 * @returns a random number (integer) between `min` and `max`.
 */
const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Converts a name into a standard format (replace any whitespace with underscore and to lower).
 * @param {string} name to standardise.
 * @returns a standardised version of the name.
 */
const standardizeName = (name) => name.trim().replace(/\s/g, '_').toLowerCase();

module.exports = {
  getRandom,
  standardizeName
};
