/**
 * Extracts validation error messages from backend error responses.
 *
 * Supports various backend validation formats:
 * - { status: false, message: "Validation failed", data: { email: ["The selected email is invalid."] }, code: 422 }
 * - { message: "Validation failed", errors: { email: ["The selected email is invalid."] } }
 * - { message: "Validation failed", "t-errors": { email: ["The selected email is invalid."] } }
 *
 * @param {object} errorResponse - The error response data (e.g. err?.response?.data)
 * @param {function} [setError] - Optional react-hook-form setError function
 * @returns {{ firstMessage: string | null, fieldErrors: Record<string, string> }}
 */
export const extractValidationErrors = (errorResponse, setError) => {
  if (!errorResponse || typeof errorResponse !== "object") {
    return { firstMessage: null, fieldErrors: {} };
  }

  const validationSource =
    (typeof errorResponse?.data === "object" &&
      !Array.isArray(errorResponse?.data) &&
      errorResponse?.data) ||
    (typeof errorResponse?.errors === "object" &&
      !Array.isArray(errorResponse?.errors) &&
      errorResponse?.errors) ||
    (typeof errorResponse?.["t-errors"] === "object" &&
      !Array.isArray(errorResponse?.["t-errors"]) &&
      errorResponse?.["t-errors"]);

  const fieldErrors = {};
  let firstMessage = null;

  if (validationSource) {
    Object.entries(validationSource).forEach(([field, messages]) => {
      let message = "";
      if (Array.isArray(messages) && messages.length > 0) {
        message = typeof messages[0] === "string" ? messages[0] : String(messages[0]);
      } else if (typeof messages === "string") {
        message = messages;
      }

      if (message) {
        fieldErrors[field] = message;
        if (!firstMessage) {
          firstMessage = message;
        }
        if (typeof setError === "function") {
          setError(field, {
            type: "server",
            message,
          });
        }
      }
    });
  }

  return { firstMessage, fieldErrors };
};

/**
 * Returns the best human-readable error message from an API error response.
 * If field validation errors exist, the first specific validation error is returned.
 *
 * @param {object} err - Axios error object
 * @param {function} [setError] - Optional react-hook-form setError function
 * @param {string} [fallback="Something went wrong. Please try again."]
 * @returns {string}
 */
export const getErrorMessage = (
  err,
  setError,
  fallback = "Something went wrong. Please try again."
) => {
  const errorResponse = err?.response?.data;

  if (typeof errorResponse === "string" && errorResponse.trim()) {
    return errorResponse;
  }

  const { firstMessage } = extractValidationErrors(errorResponse, setError);

  if (firstMessage) {
    return firstMessage;
  }

  if (typeof errorResponse?.message === "string" && errorResponse.message.trim()) {
    return errorResponse.message;
  }

  if (typeof errorResponse?.data === "string" && errorResponse.data.trim()) {
    return errorResponse.data;
  }

  if (typeof errorResponse?.error === "string" && errorResponse.error.trim()) {
    return errorResponse.error;
  }

  return fallback;
};
