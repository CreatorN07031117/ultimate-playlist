import { createSlice } from '@reduxjs/toolkit';

import { Album } from '../../types/types';
import { StoreSlice } from '../../types/enums';
import { deleteAlbum, fetchAlbumById, fetchAlbumsForPage, fetchFilteredAlbums, fetchGenres, getAlbumsCount, searchAlbums,  } from '../actions';
import type { SiteProcess } from '../../types/state';
import { ALBUMS_PER_PAGE } from '../../const';

const initialState: SiteProcess = {
  pages: 1,
  currentPage: 1,
  albums: [] as Album[],
  isAlbumsLoading: false,
  album: null,
  isAlbumLoading: false,
  isFiltered: false,
  filters: {},
  favoriteAlbums: [],
  isFavoriteAlbumsLoading: false,
  genres: [],
  sortingType: '',
  isGenresLoading: false
};

export const siteProcess = createSlice({
  name: StoreSlice.siteProcess,
  initialState,
  reducers: {
    getCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    getSortingType: (state, action) => {
      state.sortingType = action.payload;
    },
    resetFilters: (state) => {
      state.isFiltered = false;
      state.filters = {};
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAlbumsCount.fulfilled, (state, action) => {
        state.pages = Math.ceil(action.payload / ALBUMS_PER_PAGE);
      })
      .addCase(fetchAlbumsForPage.pending, (state) => {
        state.isAlbumsLoading = true;
      })
      .addCase(fetchAlbumsForPage.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.isAlbumsLoading = false;
      })
      .addCase(fetchAlbumsForPage.rejected, (state) => {
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
        state.albums = updAlbumsList;
        state.isAlbumLoading = false;
      })
      .addCase(fetchFilteredAlbums.pending, (state) => {
        state.isAlbumsLoading = true;
        state.isFiltered = true;
      })
      .addCase(fetchFilteredAlbums.fulfilled, (state, action) => {
        state.albums = action.payload.albums;
        state.pages = Math.ceil(action.payload.rows/ ALBUMS_PER_PAGE);
        state.filters = {
          genres: action.payload.filters,
        }
        state.isAlbumsLoading = false;
      })
      .addCase(fetchFilteredAlbums.rejected, (state) => {
        state.isAlbumsLoading = false;
        state.isFiltered = false;
      })
      .addCase(searchAlbums.pending, (state) => {
        state.isAlbumsLoading = true;
      })
      .addCase(searchAlbums.fulfilled, (state) => {
        state.isAlbumsLoading = false;
      })
      .addCase(searchAlbums.rejected, (state) => {
        state.isAlbumsLoading = false;
      })
  }
});

export const { getCurrentPage, getSortingType, resetFilters } = siteProcess.actions;
