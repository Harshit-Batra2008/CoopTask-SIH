/**
 * Generates a deterministic 4-digit OTP based on the request ID.
 * @param {string} requestId 
 * @returns {string} 4-digit OTP
 */
export function generateOTP(requestId) {
  let hash = 0;
  for (let i = 0; i < requestId.length; i++) {
    const char = requestId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const otpNumber = Math.abs(hash) % 10000;
  return String(otpNumber).padStart(4, '0');
}

/**
 * Verifies if the entered OTP matches the generated one for the given request ID.
 * @param {string} requestId 
 * @param {string} enteredOTP 
 * @returns {boolean}
 */
export function verifyOTP(requestId, enteredOTP) {
  return generateOTP(requestId) === enteredOTP;
}
