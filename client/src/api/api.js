import axios from "axios";
import { logout } from "../shared/utils";

const apiClient = axios.create({
  baseURL: "http://localhost:5002/api",
  timeout: 1000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const login = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const getChannelSettings = async () => {
  try {
    return await apiClient.get("/settings/channel");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const updateChannelSettings = async (data) => {
  try {
    return await apiClient.put("/settings/channel", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const changePassword = async (data) => {
  try {
    return await apiClient.patch("/settings/password", data);
  } catch (exception) {
    return {
      error: true,
      exception: exception,
    };
  }
};

export const getFollowedChannels = async () => {
  try {
    return await apiClient.get("/channels/followed");
  } catch (exception) {
    checkResponseStatus(exception);
    return {
      error: true,
      exception: exception,
    };
  }
};

export const getChannels = async () => {
  try {
    return await apiClient.get("/channels");
  } catch (exception) {
    return {
      error: true,
      exception: exception,
    };
  }
};

export const getChannelDetails = async (channelId) => {
  try {
    return await apiClient.get(`/channels/${channelId}`);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const followChannel = async (channelId) => {
  try {
    return await apiClient.post("/channels/follow", {
      channelId,
    });
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

const checkResponseStatus = (exception) => {
  const responseStatus = exception?.response?.status;

  if (responseStatus) {
    (responseStatus === 401 || responseStatus === 403) && logout();
  }
};
