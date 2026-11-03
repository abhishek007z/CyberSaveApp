const FIREBASE_API_KEY = "AIzaSyAgM1cmA5p46_GRmmEqEAUZ1y3CbUxoJ9o";
const IDENTITY_TOOLKIT_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

/**
 * Real Firebase Phone Authentication Service
 */
export const firebaseAuthService = {
  /**
   * Request OTP verification code from Firebase Identity Platform
   * @param {string} rawPhone 
   * @returns {Promise<{ sessionInfo: string, formattedPhone: string }>}
   */
  sendPhoneOtp: async (rawPhone) => {
    let cleaned = rawPhone.replace(/[\s\-()]/g, "");
    if (!cleaned.startsWith("+")) {
      if (cleaned.startsWith("91") && cleaned.length === 12) {
        cleaned = `+${cleaned}`;
      } else {
        cleaned = `+91${cleaned}`;
      }
    }

    const response = await fetch(
      `${IDENTITY_TOOLKIT_URL}:sendVerificationCode?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleaned,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || "Failed to send OTP via Firebase";
      if (errMsg.includes("BILLING_NOT_ENABLED") || errMsg.includes("OPERATION_NOT_ALLOWED")) {
        throw new Error(
          "This phone number is not registered for test access. Please use the Firebase test phone: +91 9628213302."
        );
      }
      if (errMsg.includes("INVALID_PHONE_NUMBER")) {
        throw new Error("Invalid phone number format. Please check the number.");
      }
      if (errMsg.includes("TOO_MANY_ATTEMPTS")) {
        throw new Error("Too many attempts. Please try again later.");
      }
      throw new Error(errMsg);
    }

    return {
      sessionInfo: data.sessionInfo,
      formattedPhone: cleaned,
    };
  },

  /**
   * Verify OTP with Firebase and receive authenticated Firebase ID token
   * @param {string} sessionInfo 
   * @param {string} code 
   * @returns {Promise<{ idToken: string, phoneNumber: string, localId: string }>}
   */
  verifyPhoneOtp: async (sessionInfo, code) => {
    if (!sessionInfo) {
      throw new Error("Verification session expired. Please request a new OTP.");
    }

    const response = await fetch(
      `${IDENTITY_TOOLKIT_URL}:signInWithPhoneNumber?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionInfo,
          code: code.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || "Invalid OTP";
      if (errMsg.includes("INVALID_CODE")) {
        throw new Error("Invalid OTP. The verification code entered is incorrect.");
      }
      if (errMsg.includes("SESSION_EXPIRED")) {
        throw new Error("OTP session expired. Please request a new OTP.");
      }
      throw new Error(errMsg);
    }

    return {
      idToken: data.idToken,
      phoneNumber: data.phoneNumber,
      localId: data.localId,
    };
  },
};

export default firebaseAuthService;
