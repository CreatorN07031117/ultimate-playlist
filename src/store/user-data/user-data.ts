import { createSlice } from '@reduxjs/toolkit';

import type { UserData } from '../../types/state';
import { registerUser } from '../actions';
import { AuthorizationStatus, StoreSlice } from '../../types/enums';

const initialState: UserData = {
  authorizationStatus: AuthorizationStatus.unknown,
  user: null
};

export const userProcess = createSlice({
  name: StoreSlice.userData,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.auth;
      })
      .addCase(registerUser.rejected, (state) => {
        state.user = null;
        state.authorizationStatus = AuthorizationStatus.noAuth;
      })
  }
});