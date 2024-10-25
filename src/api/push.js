import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const findPush = async () => {
  return await authorize.get("/push");
};

export const removePush = async (pushCode) => {
  return await authorize.delete(`/push/${pushCode}`);
};

export const removeAllPush = async () => {
  return await authorize.delete(`/push`);
};
