import axios from "axios";

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addSub = async (data) => {
  await authorize.post("/subscribe", data);
};

export const check = async (channelCode) => {
  return await authorize.get(`/sub/${channelCode}`);
};

export const removeSub = async (managementCode) => {
  await authorize.delete(`/subscribe/${managementCode}`);
};
