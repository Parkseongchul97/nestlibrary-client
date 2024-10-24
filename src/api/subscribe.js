import axios from "axios";

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const checkSub = async (channelCode) => {
  const response = await authorize.get(`subscribe/${channelCode}`);
  return response;
};

export const addSub = async (data) => {
  const response = await authorize.post("subscribe", data);
  return response;
};

export const removeSub = async (managementCode) => {
  const response = await authorize.delete(`subscribe/${managementCode}`);
  return response;
};

export const mySub = async () => {
  const response = await authorize.get("subscribe/channel");
  return response;
};

export const userRole = async (data) => {
  const response = await authorize.put("/subscribe/role", data);
  return response;
};
