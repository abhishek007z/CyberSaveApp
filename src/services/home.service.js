import apiClient from "./api/client";

const homeService = {
  getHomeSummary: async () => {
    const response = await apiClient.get("/main/home/summary");
    return response.data;
  },

  getGovernmentSchemes: async (params = {}) => {
    const response = await apiClient.get("/main/schemes", { params });
    return response.data;
  },

  getSchemeDetails: async (id) => {
    const response = await apiClient.get(`/main/schemes/${id}`);
    return response.data;
  },

  getNotifications: async (params = {}) => {
    const response = await apiClient.get("/main/notifications", { params });
    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await apiClient.patch(`/main/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await apiClient.post("/main/notifications/mark-all-read");
    return response.data;
  },
};

export default homeService;
