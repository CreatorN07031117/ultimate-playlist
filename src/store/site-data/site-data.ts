import { createSlice } from '@reduxjs/toolkit';

import { Album } from '../../types/types';
import { StoreSlice } from '../../types/enums';
import { deleteAlbum, fetchAlbumById, fetchAlbums, fetchGenres,  } from '../actions';
import type { SiteData } from '../../types/state';

const initialState: SiteData = {
  qtyAlbums: 0,
  albums: [] as Album[],
  isAlbumsLoading: false,
  album: null,
  isAlbumLoading: false,
  favoriteAlbums: [],
  isFavoriteAlbumsLoading: false,
  genres: [],
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
      .addCase(fetchGenres.pending, (state) => {
        state.isGenresLoading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.isGenresLoading = false;
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.isAlbumLoading = true;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        const index = state.albums.findIndex((item) => item.id === action.meta.arg)
        const updAlbumsList = [...state.albums];
        updAlbumsList.splice(index, 1);
        console.log(updAlbumsList)
        state.albums = updAlbumsList;
        state.isAlbumLoading = false;
      })
  }
});