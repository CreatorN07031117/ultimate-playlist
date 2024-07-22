import store from '../store';

import type { Album, UserData } from './types';
import type { Sorting } from './enums';
import { AuthorizationStatus } from '../components/const';


export type SiteData = {
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

export type UserData = {
    authorizationStatus: AuthorizationStatus;
    user: UserData | null;
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;