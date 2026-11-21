import apiClient from "./api/client";

const walletService = {
  getWalletSummary: async () => {
    const response = await apiClient.get("/main/wallet/summary");
    return response.data;
  },

  getAllTransactions: async (params = {}) => {
    const response = await apiClient.get("/main/wallet/transactions", { params });
    return response.data;
  },

  getTransactionDetails: async (id) => {
    const response = await apiClient.get(`/main/wallet/transactions/${id}`);
    return response.data;
  },

  addMoney: async (data) => {
    const response = await apiClient.post("/main/wallet/add-money", data);
    return response.data;
  },

  getRefundStatus: async (id) => {
    const response = await apiClient.get(`/main/wallet/refunds/${id}`);
    return response.data;
  },

  // Razorpay Real Payment Integration
  createRazorpayOrder: async (data) => {
    const response = await apiClient.post("/main/wallet/razorpay/create-order", data);
    return response.data;
  },

  verifyRazorpayPayment: async (data) => {
    const response = await apiClient.post("/main/wallet/razorpay/verify-payment", data);
    return response.data;
  },
};

export default walletService;
