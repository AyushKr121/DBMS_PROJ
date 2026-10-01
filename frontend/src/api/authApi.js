import axiosInstance from "./axiosInstance";

const authApi = {
  login: async (role, email, credential) => {
    const response = await axiosInstance.post("/auth/login", {
      role: role.toLowerCase(),
      email,
      credential,
    });

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  signup: async (userData) => {
    const response = await axiosInstance.post(
      "/auth/signup",
      userData
    );

    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};

export default authApi;