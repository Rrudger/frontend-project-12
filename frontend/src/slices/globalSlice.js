import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const globalAdapter = createEntityAdapter();
const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  currentUser: null,
}

const globalReducer = createSlice({
  name: 'globalState',
  initialState,

  reducers: {
    setStorage: (state, { payload }) => {
      state.channels = payload.channels;
      state.messages = payload.messages;
      state.currentChannelId = payload.currentChannelId;
    },
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    addMessage: (state, { payload }) => {
      state.messages = [...state.messages, payload]

    },
    addChannel: (state, { payload }) => {
      state.channels = [...state.channels, payload];
      state.currentChannelId = payload.id;
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload);
      state.currentChannelId = 1;
    },
    renameChannel: (state, { payload }) => {
      state.channels = state.channels.map((channel) => {
        if (channel.id === payload.id) {
          return payload;
        } else {
          return channel;
        }
      })
    }
  }
});

export default globalReducer.reducer;
export const selectors = globalAdapter.getSelectors((state) => state.globalState);
export const { actions } = globalReducer;
