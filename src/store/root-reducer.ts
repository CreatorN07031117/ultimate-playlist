
import { combineReducers } from '@reduxjs/toolkit';

import { siteProcess } from './site-process/site-process';
import { userProcess } from './user-data/user-data';
import { StoreSlice } from '../types/enums';

export const rootReducer = combineReducers({
  [StoreSlice.siteProcess]: siteProcess.reducer,
  [StoreSlice.userData]: userProcess.reducer,
});

