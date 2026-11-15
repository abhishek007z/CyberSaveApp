import apiClient from "./api/client";

const profileService = {
  getProfileOverview: async () => {
    const response = await apiClient.get("/main/profile/overview");
    return response.data;
  },

  updatePersonalInfo: async (data) => {
    const response = await apiClient.patch("/main/profile/personal-info", data);
    return response.data;
  },

  getDocuments: async (params = {}) => {
    const response = await apiClient.get("/main/profile/documents", { params });
    return response.data;
  },

  addDocument: async (data) => {
    const response = await apiClient.post("/main/profile/documents", data);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await apiClient.delete(`/main/profile/documents/${id}`);
    return response.data;
  },

  clearCache: async () => {
    const response = await apiClient.post("/main/profile/clear-cache");
    return response.data;
  },

  getAddresses: async () => {
    const response = await apiClient.get("/main/profile/addresses");
    return response.data;
  },

  addAddress: async (data) => {
    const response = await apiClient.post("/main/profile/addresses", data);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await apiClient.delete(`/main/profile/addresses/${id}`);
    return response.data;
  },

  getFaqs: async (params = {}) => {
    const response = await apiClient.get("/main/profile/faqs", { params });
    return response.data;
  },

  raiseTicket: async (data) => {
    const response = await apiClient.post("/main/profile/tickets", data);
    return response.data;
  },

  submitFeedback: async (data) => {
    const response = await apiClient.post("/main/profile/feedback", data);
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await apiClient.delete("/main/profile/account");
    return response.data;
  },

  exportDigitalData: async () => {
    const response = await apiClient.get("/main/profile/export-data");
    return response.data;
  },
};

export default profileService;
