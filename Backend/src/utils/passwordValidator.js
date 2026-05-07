import Setting from "../models/Setting.model.js";

/**
 * Validates a password against the saved security policy
 * @param {string} password - The password to validate
 * @returns {Promise<{isValid: boolean, message: string}>}
 */
export const validatePasswordAgainstPolicy = async (password) => {
  const policySetting = await Setting.findOne({ name: "password_policy" });
  
  const policy = policySetting?.data || {
    mfaEnabled: true,
    minPasswordLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  };

  if (password.length < policy.minPasswordLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${policy.minPasswordLength} characters long.` 
    };
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number." };
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character." };
  }

  return { isValid: true, message: "Password is valid." };
};
