import axiosInstance from "./axiosInstance";

const authApi = {
  login: async (userId, password) => {
    const response = await axiosInstance.post("/auth/login", {
      userId,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosInstance.post(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      }
    );
    return response.data;
  },
};

export default authApi;
