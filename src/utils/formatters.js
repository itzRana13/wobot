/**
 * Utility functions for formatting camera data
 * @module utils/formatters
 */

/**
 * Formats location data into a readable string
 * @param {string|Object} location - Location as string or object with city/state
 * @returns {string} Formatted location string
 */
export const formatLocation = (location) => {
  if (!location) return "N/A";
  if (typeof location === "string") return location;
  const city = location.city || "";
  const state = location.state || "";
  return city && state ? `${city}, ${state}` : city || state || "N/A";
};

/**
 * Formats recorder data into a readable string
 * @param {string|Object} recorder - Recorder as string or object with name
 * @returns {string} Formatted recorder string
 */
export const formatRecorder = (recorder) => {
  if (!recorder) return "N/A";
  if (typeof recorder === "string") return recorder;
  return recorder.name || "N/A";
};

/**
 * Formats tasks data into a readable string with count
 * @param {string|number|Array} tasks - Tasks as string, number, or array
 * @returns {string} Formatted tasks string
 */
export const formatTasks = (tasks) => {
  if (!tasks) return "N/A";
  // Handle string format like "4" or array format
  const count =
    typeof tasks === "string"
      ? parseInt(tasks) || 0
      : Array.isArray(tasks)
      ? tasks.length
      : tasks;
  if (count === 0) return "N/A";
  return `${count} Task${count !== 1 ? "s" : ""}`;
};

