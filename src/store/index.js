import { configureStore } from "@reduxjs/toolkit";
import channelSlice from "./channelSlice";
// 리덕스 스토어 : 모든 상태를 관리하는 중앙 저장소

const store = configureStore({ reducer: channelSlice.reducer });

export default store;
