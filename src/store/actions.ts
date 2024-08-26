import type { History } from 'history';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@supabase/supabase-js';
import { RcFile } from 'antd/es/upload';

import { adaptUserDataToClient } from '../adapters/adapters-to-client';
import type { Album, UserData } from '../types/types';
import { CreateUserDTO } from '../adapters/user.dto';
import { ALBUMS_PER_PAGE, AppRoute } from '../const';
import { dropToken, saveToken } from '../helpers/token-functions';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ALBUMS_TABLE = 'albums';
const PROFILES_TABLE = 'profiles';
const STORAGE = 'cover_img';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

type Extra = {
  navigate(arg0: string): unknown;
  history: History;
};

export const getAlbumsCount = createAsyncThunk<number, void>(
  'albums',
  async () => {
    const response = await supabase
      .from(ALBUMS_TABLE)
      .select('*', { count: 'exact', head: true });

    if (response.error) {
      console.error('Error fetching row count:', response.error);
      return;
    }
    return response.count;
  }
);

//ToDo: Вкрячить внутрь или сдела
interface FetchAlbumsArgs {
  pageNumber: number;
  sortingType?: string;
}

export const fetchAlbumsForPage = createAsyncThunk<Album[], FetchAlbumsArgs>(
  'albums/fetch',
  async ({ pageNumber = 1, sortingType }: FetchAlbumsArgs) => {
    const start = (pageNumber - 1) * ALBUMS_PER_PAGE;
    const end = start + ALBUMS_PER_PAGE - 1;

    let fetch = supabase.from(ALBUMS_TABLE).select('*').range(start, end);

    if (sortingType !== '') {
      fetch = fetch.order('releaseDate', {
        ascending: sortingType === 'early',
      });
    }

    const { data, error } = await fetch;

    if (error) {
      throw error;
    }
    return data as Album[];
  }
);

export const fetchGenres = createAsyncThunk<string[], undefined>(
  'genres/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc('get_unique_genres');

      if (error) throw error;

      return data.map((row) => row.genre);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlbumById = createAsyncThunk<Album, string>(
  'albums/id/fetch',
  async (albumId) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .select('*')
      .eq('id', albumId);

    if (error) {
      throw error;
    }

    return data[0];
  }
);

export const addAlbum = createAsyncThunk<
  Album,
  { albumData: Album; cover: File }
>('albums/add', async ({ albumData, cover }) => {
  const { data: album, error: albumDownloadError } = await supabase
    .from(ALBUMS_TABLE)
    .insert(albumData)
    .select();

  if (albumDownloadError) {
    throw albumDownloadError;
  }

  const fileResponse = await supabase.storage
    .from(STORAGE)
    .upload(cover.name, cover, {
      contentType: 'image/jpeg',
    });

  if (fileResponse.error) {
    const response = await supabase.storage
      .from(STORAGE)
      .list('', { search: cover.name });

    if (response.error) {
      throw response.error;
    }
  }

  return album[0];
});

export const updateAlbum = createAsyncThunk<
  Album,
  { albumData: Album; id: string }
>('albums/update', async ({ albumData, id }) => {
  const { data, error } = await supabase
    .from(ALBUMS_TABLE)
    .update({ ...albumData })
    .eq('id', id);

  if (error) {
    throw error;
  }

  return data;
});

export const fetchFilteredAlbums = createAsyncThunk<
  {
    albums: Album[];
    rows: number;
    filters: string;
  },
  { genre: string; pageNumber: number; sortingType?: string }
>('albums/filtered', async ({ genre, pageNumber = 1, sortingType }) => {
  const start = (pageNumber - 1) * ALBUMS_PER_PAGE;
  const end = start + ALBUMS_PER_PAGE - 1;

  let fetch = supabase
    .from(ALBUMS_TABLE)
    .select('*', { count: 'exact' })
    .contains('genres', [genre])
    .range(start, end);

  if (sortingType !== '') {
    fetch = fetch.order('releaseDate', { ascending: sortingType === 'early' });
  }

  const response = await fetch;

  if (response.error) {
    throw response.error;
  }

  return {
    rows: response.count,
    albums: response.data as Album[],
    filters: genre,
  };
});

export const deleteAlbum = createAsyncThunk<Album | null, string>(
  'albums/delete',
  async (albumId) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .delete()
      .eq('id', albumId);

    if (error) {
      console.error('Ошибка при удалении:', error);
      throw error;
    }

    return data;
  }
);

export const searchAlbums = createAsyncThunk<Album[], string>(
  'albums/search',
  async (searchTerm) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,musician.ilike.%${searchTerm}%`);

    if (error) {
      console.error('Ошибка при выполнении запроса:', error);
      return [];
    }

    return data;
  }
);

export const registerUser = createAsyncThunk<
  UserData,
  { email: string; password: string; name: string },
  { extra: Extra }
>('users/signUp', async ({ email, password, name }, { extra }) => {
  const { data: userData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    throw signupError;
  }

  const { data, error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .insert({
      id: userData.user?.id,
      email: email,
      userType: 'user',
      name: name,
      favorites: [],
    })

  if (insertError) {
    throw insertError;
  }

  saveToken(userData.session?.access_token as string);

  extra.history.push(AppRoute.Root);

  return null;
});

export const signIn = createAsyncThunk<
  UserData,
  { email: string; password: string },
  { extra: Extra }
>('users/signIn', async ({ email, password }, { extra }) => {
  const { data: userData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

  if (signInError) {
    console.error('Ошибка при входе:', signInError.message);
    throw signInError;
  }

  const { data, error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userData.user.id);

  if (insertError) {
    throw insertError;
  }

  extra.history.push(AppRoute.Root);

  return adaptUserDataToClient({...data[0], id: userData.user.id} as unknown as CreateUserDTO);
});

export const signOut = createAsyncThunk<null, undefined>(
  'users/sighout',
  async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
    dropToken();
    return null;
  }
);

//ToDo: Перенести в типы
type UploadURLType = {
  fullPath: string;
  id: string;
  path: string;
};

export const getUserStatus = createAsyncThunk<UserData, string>(
  'users/get',
  async (accessToken) => {
    const { data: userData, error: signError } =
      await supabase.auth.getUser(accessToken);

    if (signError) {
      throw signError;
    }

    const { data, error: insertError } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('id', userData.user.id);

    if (insertError) {
      throw insertError;
    }
    console.log(data[0])
    return adaptUserDataToClient({...data[0], id: userData.user.id} as unknown as CreateUserDTO);
  }
);

export const uploadFile = createAsyncThunk<UploadURLType, RcFile>(
  'file/upload',
  async (file) => {
    const { data, error } = await supabase.storage
      .from(STORAGE)
      .upload(file.name, file, {
        contentType: 'image/jpeg',
      });

    if (error) {
      const response = await supabase.storage
        .from(STORAGE)
        .list('', { search: file.name });

      if (response.error) {
        throw response.error;
      }
      console.log(response.data);
      return {
        id: response.data[0].id,
        name: response.data[0].name,
        fullPath: `${STORAGE}/${response.data[0].name}`,
      };
    } else {
      return data;
    }
  }
);

export const updateUserFavoritesList = createAsyncThunk<
  string[],
  { albumId: string; userId: string }
>('users/updates', async ({ albumId, userId }) => {
  const { data, error } = await supabase.rpc('toggle_favorite_album', {
    user_id: userId,
    album_id: albumId,
  });

  if (error) throw error;

  return data;
});
