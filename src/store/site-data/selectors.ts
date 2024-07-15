import { createSelector } from '@reduxjs/toolkit';

import type { State } from '../../types/state';
import { StoreSlice } from '../../types/enums';
import type { Album } from '../../types/types';

export const getIsAlbumsLoading = ({ [StoreSlice.siteData]: SITE_DATA }: State): boolean => SITE_DATA.isAlbumsLoading;
export const getAlbums = ({ [StoreSlice.siteData]: SITE_DATA}: State): Album[] => SITE_DATA.albums;

export const getIsFavoriteAlbumsLoading = ({ [StoreSlice.siteData]: SITE_DATA }: State): boolean => SITE_DATA.isFavoriteAlbumsLoading;
export const getFavoriteAlbums = ({ [StoreSlice.siteData]: SITE_DATA}: State): Album[] => SITE_DATA.favoriteAlbums;

export const getIsAlbumLoading = ({ [StoreSlice.siteData]: SITE_DATA }: State): boolean => SITE_DATA.isAlbumsLoading;
export const getAlbum = ({ [StoreSlice.siteData]: SITE_DATA }: State): Album | null => SITE_DATA.album;

export const selectOffers = createSelector(
  [getAlbums],
  (albums) => albums
);
