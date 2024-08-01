import store from '../store';

import type { Album, UserData } from './types';
import type { Sorting } from './enums';
import { AuthorizationStatus } from '../components/const';


export type SiteData = {
    genres: string[];
    isGenresLoading: boolean;
    albums: Album[];
    isAlbumsLoading: boolean;
    album: Album | null;
    isAlbumLoading: boolean;
    favoriteAlbums: Album[];
    isFavoriteAlbumsLoading: boolean;
};

export type SiteProcess = {
    sorting: Sorting;
}

export type User = {
    authorizationStatus: AuthorizationStatus;
    user: UserData | null;
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;