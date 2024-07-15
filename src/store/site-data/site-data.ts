import { createSlice } from '@reduxjs/toolkit';

import { Album } from '../../types/types';
import { StoreSlice } from '../../types/enums';
import { fetchAlbumById, fetchAlbums } from '../actions';
import type { SiteData } from '../../types/state';

const initialState: SiteData = {
  albums: [] as Album[],
  isAlbumsLoading: false,
  album: null,
  isAlbumLoading: false,
  favoriteAlbums: [],
  isFavoriteAlbumsLoading: false,
};

export const siteData = createSlice({
  name: StoreSlice.siteData,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.isAlbumsLoading = true;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.isAlbumsLoading = false;
      })
      .addCase(fetchAlbums.rejected, (state) => {
        state.isAlbumsLoading = false;
      })
      .addCase(fetchAlbumById.pending, (state) => {
        state.isAlbumLoading = true;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.album = action.payload;
        state.isAlbumLoading = false;
      })
      .addCase(fetchAlbumById.rejected, (state) => {
        state.isAlbumLoading = false;
      })
  }
});