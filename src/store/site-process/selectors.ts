import { createSelector } from '@reduxjs/toolkit';

import type { State } from '../../types/state';
import { StoreSlice } from '../../types/enums';
import type { Album } from '../../types/types';

export const getIsAlbumsLoading = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State): boolean => SITE_PROCESS.isAlbumsLoading;
export const getAlbums = ({ [StoreSlice.siteProcess]: SITE_PROCESS}: State): Album[] => SITE_PROCESS.albums;

export const getIsFavoriteAlbumsLoading = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State): boolean => SITE_PROCESS.isFavoriteAlbumsLoading;
export const getFavoriteAlbums = ({ [StoreSlice.siteProcess]: SITE_PROCESS}: State): Album[] => SITE_PROCESS.favoriteAlbums;

export const getIsAlbumLoading = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State): boolean => SITE_PROCESS.isAlbumsLoading;
export const getAlbum = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State): Album | null => SITE_PROCESS.album;

export const getGenres = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State ): string[] => SITE_PROCESS.genres;
export const getIsGenresLoading = ({ [StoreSlice.siteProcess]: SITE_PROCESS }: State ): boolean => SITE_PROCESS.isGenresLoading;

export const selectOffers = createSelector(
  [getAlbums],
  (albums) => albums
);
