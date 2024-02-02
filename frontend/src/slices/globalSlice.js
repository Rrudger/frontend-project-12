import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { merge } from 'lodash';

const globalAdapter = createEntityAdapter();
const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  currentUser: null,
  lastChannelAddedBy: null,
};

const globalReducer = createSlice({
  name: 'globalState',
  initialState,

  reducers: {
    setStorage: (state, { payload }) => merge(
      state,
      {
        channels: payload.channels,
        messages: payload.messages,
        currentChannelId: payload.currentChannelId,
      },
    ),
    setCurrentChannel: (state, { payload }) => merge(state, { currentChannelId: payload }),
    setCurrentUser: (state, { payload }) => merge(state, { currentUser: payload }),
    setLastChannelAddedBy: (state, { payload }) => merge(state, { lastChannelAddedBy: payload }),
    addMessage: (state, { payload }) => merge(state, { messages: [...state.messages, payload] }),
    addChannel: (state, { payload }) => merge(state, { channels: [...state.channels, payload] }),
    removeChannel: (state, { payload }) => {
      /*const newChannelList = state.channels.filter((channel) => channel.id !== payload);
      return merge(state, { channels: newChannelList, currentChannelId: 1 });*/
      state.channels = state.channels.filter((channel) => channel.id !== payload);
      state.currentChannelId = 1;
      //Не работает в правильном варианте
    },
    renameChannel: (state, { payload }) => {
      const newChannelList = state.channels.map((channel) => {
        if (channel.id === payload.id) {
          return payload;
        }
        return channel;
      });
      return merge(state, { channels: newChannelList });
    },
  },
});

export default globalReducer.reducer;
export const selectors = globalAdapter.getSelectors((state) => state.globalState);
export const { actions } = globalReducer;
