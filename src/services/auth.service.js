import apiClient from "./api/client";

const authService = {
  register: async (userData) => {
    const response = await apiClient.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  sendOtp: async (email) => {
    const response = await apiClient.post(
      "/auth/send-otp",
      { email }
    );

    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await apiClient.post(
      "/auth/verify-otp",
      {
        email,
        otp,
      }
    );

    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get(
      "/auth/profile"
    );

    return response.data;
  },
};

export default authService;