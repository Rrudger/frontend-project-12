import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../slices/globalSlice.js';

export default configureStore({
  reducer: {
    globalState: globalReducer,
  },
});
