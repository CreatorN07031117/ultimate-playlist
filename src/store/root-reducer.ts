
import { combineReducers } from '@reduxjs/toolkit';

import { siteData } from './site-data/site-data';
import { StoreSlice } from '../types/enums';

export const rootReducer = combineReducers({
  [StoreSlice.siteData]: siteData.reducer,
});

