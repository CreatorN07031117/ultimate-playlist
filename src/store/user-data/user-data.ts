import { createSlice } from '@reduxjs/toolkit';

import type { User } from '../../types/state';
import { getUserStatus, registerUser, signIn } from '../actions';
import { AuthorizationStatus, StoreSlice } from '../../types/enums';

const initialState: User = {
  authorizationStatus: AuthorizationStatus.unknown,
  user: null
};

export const userProcess = createSlice({
  name: StoreSlice.userData,
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.authorizationStatus = AuthorizationStatus.noAuth;
    },
  },
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
      .addCase(getUserStatus.pending, (state) => {
        state.authorizationStatus = AuthorizationStatus.unknown
      })
      .addCase(getUserStatus.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.auth;
        state.user = action.payload;
      })
      .addCase(getUserStatus.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.noAuth;
        state.user = null;
      })
  }
});

export const { logOut } = userProcess.actions;
