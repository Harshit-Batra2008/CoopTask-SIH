const STORAGE_KEY = 'cooptask_state';

/**
 * Saves the application state to localStorage.
 * @param {Object} state 
 */
export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

/**
 * Loads the application state from localStorage.
 * @returns {Object|null} The parsed state or null if parsing fails or not found
 */
export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return null;
  }
}

/**
 * Clears the application state from localStorage.
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear state from localStorage:', err);
  }
}

/**
 * Checks if there is a persisted state in localStorage.
 * @returns {boolean}
 */
export function hasPersistedState() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (err) {
    return false;
  }
}
