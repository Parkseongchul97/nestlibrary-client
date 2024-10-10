import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, nicknameCheck } from "../api/user";

export const add = createAsyncThunk("comment/add", async (data) => {
  const response = await addComment(data);
  return response.data;
});
export const comments = createAsyncThunk(
  "comment/comments",
  async (videoCode) => {
    const response = await viewComments(videoCode);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    commentList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add.fulfilled, (state, action) => {
        // 댓글 목록에 댓글 추가?
        state.commentList = [action.payload, ...state.commentList];
      })
      .addCase(comments.fulfilled, (state, action) => {
        state.commentList = action.payload;
      });
  },
});

export default commentSlice;
