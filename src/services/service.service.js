import apiClient from "./api/client";

const serviceService = {
  getCatalogue: async (params = {}) => {
    const response = await apiClient.get("/main/services/catalogue", { params });
    return response.data;
  },

  getServiceDetails: async (id) => {
    const response = await apiClient.get(`/main/services/catalogue/${id}`);
    return response.data;
  },

  applyForService: async (data) => {
    const response = await apiClient.post("/main/services/apply", data);
    return response.data;
  },

  getMyApplications: async (params = {}) => {
    const response = await apiClient.get("/main/services/my-applications", { params });
    return response.data;
  },

  getApplicationDetails: async (id) => {
    const response = await apiClient.get(`/main/services/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await apiClient.patch(`/main/services/applications/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export default serviceService;
