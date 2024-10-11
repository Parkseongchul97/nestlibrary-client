import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, nicknameCheck } from "../api/user";

export const userLogin = createAsyncThunk("user/login", async (data) => {
  const response = await login(data);
  return response.data;
});

export const userRegister = createAsyncThunk("user/register", async (data) => {
  const response = await register(data);
  return response.data;
});

export const userNicknameCheck = createAsyncThunk(
  "user/nickname",
  async (nickname) => {
    const response = await nicknameCheck(nickname);
    return response.data;
  }
);
export const updateUser = createAsyncThunk("user/update", async (data) => {
  return await authorize.put("update", data);
});

const commentSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      userEmail: "",
      userPassword: "",
      userNickname: "",
      userImgUrl: "",
      userInfo: "",
      userPoint: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        // 로그인
        state.user = action.payload;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.commentList = action.payload;
      });
  },
});

export default commentSlice;
