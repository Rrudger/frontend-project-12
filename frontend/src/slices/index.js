import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './globalSlice.js';
import langReducer from './lang.js';

export default configureStore({
  reducer: {
    globalState: globalReducer,
    langState: langReducer,
  },
});
