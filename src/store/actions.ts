import type { History } from 'history';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@supabase/supabase-js';
import { RcFile } from 'antd/es/upload';
import { toast } from 'react-toastify';

import { adaptUserDataToClient } from '../adapters/adapters-to-client';
import { dropToken, saveToken } from '../helpers/token-functions';
import { CreateUserDTO } from '../adapters/user.dto';
import { ALBUMS_PER_PAGE, AppRoute } from '../const';
import type { Album, UserData } from '../types/types';

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

interface FetchAlbumsArgs {
  pageNumber: number;
  sortingType?: string;
}

export const fetchAlbumsForPage = createAsyncThunk<
  Album[],
  FetchAlbumsArgs,
  { extra: Extra }
>('albums/fetch', async ({ pageNumber = 1, sortingType }: FetchAlbumsArgs) => {
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
    toast.error(error.message);
    throw error;
  }
  return data as Album[];
});

export const fetchGenres = createAsyncThunk<
  string[],
  undefined,
  { extra: Extra }
>('genres/fetch', async () => {
  const { data, error: genresError } = await supabase.rpc('get_unique_genres');

  if (genresError) {
    toast.error(genresError.message);
    throw genresError;
  }

  return data.map((row: string) => row.genre);
});

export const fetchAlbumById = createAsyncThunk<Album, string, { extra: Extra }>(
  'albums/id/fetch',
  async (albumId, { extra }) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .select('*')
      .eq('id', albumId);

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (data.length === 0) {
      extra.history.push(AppRoute.NotFound);
    }

    return data[0];
  }
);

export const addAlbum = createAsyncThunk<
  Album,
  { albumData: Album; cover: File },
  { extra: Extra }
>('albums/add', async ({ albumData, cover }) => {
  const { data: album, error: albumDownloadError } = await supabase
    .from(ALBUMS_TABLE)
    .insert(albumData)
    .select();

  if (albumDownloadError) {
    toast.error(albumDownloadError.message);
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
      toast.error(response.error.message);
      throw response.error;
    }
  }
  toast.success('Album  has been created');
  return album[0];
});

export const updateAlbum = createAsyncThunk<
  Album,
  { albumData: Album; id: string },
  { extra: Extra }
>('albums/update', async ({ albumData, id }) => {
  const { data, error } = await supabase
    .from(ALBUMS_TABLE)
    .update({ ...albumData })
    .eq('id', id);

  if (error) {
    toast.error(error.message);
    throw error;
  }

  toast.success('Album has been updated');
  return data;
});

export const fetchFilteredAlbums = createAsyncThunk<
  {
    albums: Album[];
    rows: number;
    filters: string;
  },
  { genre: string; pageNumber: number; sortingType?: string },
  { extra: Extra }
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
    toast.error(response.error.message);
    throw response.error;
  }

  return {
    rows: response.count,
    albums: response.data as Album[],
    filters: genre,
  };
});

export const deleteAlbum = createAsyncThunk<
  Album | null,
  string,
  { extra: Extra }
>('albums/delete', async (albumId) => {
  const { data, error } = await supabase
    .from(ALBUMS_TABLE)
    .delete()
    .eq('id', albumId);

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return data;
});

export const searchAlbums = createAsyncThunk<Album[], string, { extra: Extra }>(
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
    toast.error(signupError.message);
    throw signupError;
  }

  const { error: insertError } = await supabase.from(PROFILES_TABLE).insert({
    id: userData.user?.id,
    email: email,
    userType: 'user',
    name: name,
    favorites: [],
  });

  if (insertError) {
    toast.error(insertError.message);
    throw insertError;
  }

  saveToken(userData.session?.access_token as string);

  toast.success('User has been created');
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
    toast.error(signInError.message);
    throw signInError;
  }

  const { data, error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userData.user.id);

  if (insertError) {
    toast.error(insertError.message);
    throw insertError;
  }

  extra.history.push(AppRoute.Root);

  return adaptUserDataToClient({
    ...data[0],
    id: userData.user.id,
  } as unknown as CreateUserDTO);
});

export const signOut = createAsyncThunk<null, undefined, { extra: Extra }>(
  'users/sighout',
  async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      throw error;
    }
    dropToken();
    return null;
  }
);

type UploadURLType = {
  fullPath: string;
  id: string;
  path: string;
};

export const getUserStatus = createAsyncThunk<
  UserData,
  string,
  { extra: Extra }
>('users/get', async (accessToken) => {
  const { data: userData, error: signError } =
    await supabase.auth.getUser(accessToken);

  if (signError) {
    toast.error(signError.message);
    throw signError;
  }

  const { data, error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userData.user.id);

  if (insertError) {
    toast.error(insertError.message);
    throw insertError;
  }

  return adaptUserDataToClient({
    ...data[0],
    id: userData.user.id,
  } as unknown as CreateUserDTO);
});

export const uploadFile = createAsyncThunk<
  UploadURLType,
  RcFile,
  { extra: Extra }
>('file/upload', async (file) => {
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
      toast.error(response.error.message);
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
});

export const updateUserFavoritesList = createAsyncThunk<
  string[],
  { albumId: string; userId: string },
  { extra: Extra }
>('users/updates', async ({ albumId, userId }) => {
  const { data, error } = await supabase.rpc('toggle_favorite_album', {
    user_id: userId,
    album_id: albumId,
  });

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return data;
});
