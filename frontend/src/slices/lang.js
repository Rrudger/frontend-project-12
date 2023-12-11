import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import i18n from '../i18n';

const langAdapter = createEntityAdapter();
const initialState =  {
  language: localStorage.getItem('lang') || 'ru',
}

const langReducer = createSlice({
  name: 'langState',
  initialState,

  reducers: {
    setLanguage: (state, { payload }) => {
      state.language = payload;
      i18n.changeLanguage(payload);
    },

  }
});

export default langReducer.reducer;
export const selectors = langAdapter.getSelectors((state) => state.langState);
export const { actions } = langReducer;
