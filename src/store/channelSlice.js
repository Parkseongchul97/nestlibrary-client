import { createSlice } from "@reduxjs/toolkit";
import { create, nameCheck } from "../api/channel";

// createSlice로 리듀스 정리
const channelSlice = createSlice({
  name: "channel", // 슬라이스명
  initialState: { channel: null }, // 초기 상태,
  reducers: {
    createChannel: async (state) => {
      const response = await create(state.channel);
    },
    channelNameCheck: async (state) => {
      const response = await nameCheck(
        state.channel.channelName,
        state.channel.channelCode
      );
    },
  },
});
// 액션 내보내기
export const { createChannel, channelNameCheck } = channelSlice.actions;
export default channelSlice;
