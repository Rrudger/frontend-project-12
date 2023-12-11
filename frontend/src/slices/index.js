import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../slices/globalSlice.js';
import langReducer from '../slices/lang.js';

export default configureStore({
  reducer: {
    globalState: globalReducer,
    langState: langReducer,
  },
});
