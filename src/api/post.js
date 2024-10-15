import axios from "axios";

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const add = async (data) => {
  await authorize.post("/post", data);
};
