import { createSlice } from '@reduxjs/toolkit';

import type { User } from '../../types/state';
import { registerUser, signIn } from '../actions';
import { AuthorizationStatus, StoreSlice } from '../../types/enums';

const initialState: User = {
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
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.auth;
      })
      .addCase(signIn.rejected, (state) => {
        state.user = null;
        state.authorizationStatus = AuthorizationStatus.noAuth;
      })
  }
});