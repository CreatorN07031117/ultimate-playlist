import store from '../store';

import type { Album, UserData } from './types';
import { AuthorizationStatus } from '../const';


export type SiteProcess = {
    pages: number;
    currentPage: number;
    genres: string[];
    isGenresLoading: boolean;
    albums: Album[];
    isAlbumsLoading: boolean;
    isFiltered: boolean;
    filters: {
      [key: string]: string;
    }
    album: Album | null;
    isAlbumLoading: boolean;
    favoriteAlbums: Album[];
    isFavoriteAlbumsLoading: boolean;
    sortingType: string;
};

export type User = {
    authorizationStatus: AuthorizationStatus;
    user: UserData | null;
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;