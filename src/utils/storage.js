// LT-038: Validate that loaded state matches the expected type of defaultValue
export const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    const parsed = JSON.parse(serializedState);
    // Basic shape validation: if defaultValue is an object, parsed must also be an object (not array/null)
    if (
      defaultValue !== null &&
      typeof defaultValue === 'object' &&
      !Array.isArray(defaultValue) &&
      (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)
    ) {
      console.warn(`Corrupted state for key "${key}", using default.`);
      return defaultValue;
    }
    return parsed;
  } catch (err) {
    console.error(`Error loading state for key "${key}":`, err);
    return defaultValue;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error(`Error saving state for key "${key}":`, err);
  }
};

export const removeState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing state for key "${key}":`, err);
  }
};
