import apiClient from "./api/client";

const languageService = {
  getLanguages: async () => {
    const response = await apiClient.get("/auth/language");
    return response.data;
  },

  updateLanguage: async (language, extra = {}) => {
    const response = await apiClient.patch("/auth/language", {
      language,
      ...extra,
    });
    return response.data;
  },
};

export default languageService;
