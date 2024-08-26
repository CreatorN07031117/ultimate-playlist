import { createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@supabase/supabase-js';
import { RcFile } from 'antd/es/upload';
import { toast } from 'react-toastify';

import { adaptUserDataToClient, CreateUserDTO } from '../adapters/adapters-to-client';
import { dropToken, saveToken } from '../helpers/token-functions';
import { ALBUMS_PER_PAGE } from '../const';
import type { Album, UserData } from '../types/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ALBUMS_TABLE = 'albums';
const PROFILES_TABLE = 'profiles';
const STORAGE = 'cover_img';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export const getAlbumsCount = createAsyncThunk<number, void, { rejectValue: string }>(
  'albums/getCount',
  async (_, { rejectWithValue }) => {
    const response = await supabase
      .from(ALBUMS_TABLE)
      .select('*', { count: 'exact', head: true });

    if (response.error) {
      toast.error(response.error.message);
      return rejectWithValue('Failed to fetch album count');
    }

    return response.count as number;
  }
);

interface FetchAlbumsArgs {
  pageNumber: number;
  sortingType?: string;
}

export const fetchAlbumsForPage = createAsyncThunk<
  Album[],
  FetchAlbumsArgs,
  { rejectValue: string }
>('albums/fetch', async ({ pageNumber = 1, sortingType }, { rejectWithValue }) => {
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
    return rejectWithValue('Failed to fetch albums');
  }
  return data as Album[];
});

export const fetchGenres = createAsyncThunk<
  string[],
  undefined,
  object
>('genres/fetch', async () => {
  const { data, error: genresError } = await supabase.rpc('get_unique_genres');

  if (genresError) {
    toast.error(genresError.message);
    throw genresError;
  }

  return data.map((row: {genre: 'string'}) => row.genre);
});

export const fetchAlbumById = createAsyncThunk<Album, string, { rejectValue: string }>(
  'albums/id/fetch',
  async (albumId, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .select('*')
      .eq('id', albumId);

    if (error) {
      toast.error(error.message);
      return rejectWithValue('Failed to fetch album');
    }

    return data[0];
  }
);

export const addAlbum = createAsyncThunk<
  Album,
  { albumData: Album; cover: File },
  { rejectValue: string }
>('albums/add', async ({ albumData, cover }, { rejectWithValue }) => {
  const { data: album, error: albumDownloadError } = await supabase
    .from(ALBUMS_TABLE)
    .insert(albumData)
    .select();

  if (albumDownloadError) {
    toast.error(albumDownloadError.message);
    return rejectWithValue(albumDownloadError.message);
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
      return rejectWithValue(response.error.message);
    }
  }
  toast.success('Album  has been created');
  return album[0];
});

export const updateAlbum = createAsyncThunk<
  Album[],
  { albumData: Album; id: string },
  { rejectValue: string }
>('albums/update', async ({ albumData, id }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from(ALBUMS_TABLE)
    .update({ ...albumData })
    .eq('id', id)
    .select();
  if (error) {
    toast.error(error.message);
    return rejectWithValue(error.message);
  }

  toast.success('Album has been updated');
  return data as Album[];
});

export const fetchFilteredAlbums = createAsyncThunk<
  { albums: Album[]; rows: number; filters: string },
  { genre: string; pageNumber: number; sortingType?: string },
  { rejectValue: string }
>('albums/filtered', async ({ genre, pageNumber = 1, sortingType }, { rejectWithValue }) => {
  const start = (pageNumber - 1) * ALBUMS_PER_PAGE;
  const end = start + ALBUMS_PER_PAGE - 1;

  let fetch = supabase
    .from(ALBUMS_TABLE)
    .select('*', { count: 'exact' })
    .contains('genres', [genre])
    .range(start, end);

  if (sortingType) {
    fetch = fetch.order('releaseDate', { ascending: sortingType === 'early' });
  }

  const response = await fetch;

  if (response.error) {
    toast.error(response.error.message);
    return rejectWithValue(response.error.message); 
  }

  return {
    rows: response.count ?? 0,
    albums: response.data as Album[], 
    filters: genre,
  };
});

export const deleteAlbum = createAsyncThunk<
  Album | null,
  string,
  object
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

export const searchAlbums = createAsyncThunk<Album[], string, object>(
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
  { rejectValue: string; }
>(
  'users/signUp',
  async (
    { email, password, name }, 
    { rejectWithValue }
  ) => {
    const { data: userData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      toast.error(signupError.message);
      return rejectWithValue(signupError.message);
    }

    const { data, error: insertError } = await supabase.from(PROFILES_TABLE)
    .insert({
      id: userData.user?.id,
      email: email,
      userType: 'user',
      name: name,
      favorites: [],
    }).select();

    if (insertError) {
      toast.error(insertError.message);
      return rejectWithValue(insertError.message);
    }

    saveToken(userData.session?.access_token as string);

    toast.success('User has been created');
    return adaptUserDataToClient({...data[0], id: userData.user?.id}as unknown as CreateUserDTO);;
  }
);

export const signIn = createAsyncThunk<
  UserData,
  { email: string; password: string },
  { rejectValue: string; }
>(
  'users/signIn', 
  async (
    { email, password }, 
    { rejectWithValue }
  ) => {
  const { data: userData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

  if (signInError) {
    toast.error(signInError.message);
    return rejectWithValue(signInError.message);
  }

  const { data, error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userData.user.id);

  if (insertError) {
    toast.error(insertError.message);
    return rejectWithValue(insertError.message);
  }

  return adaptUserDataToClient({
    ...data[0],
    id: userData.user.id,
  } as unknown as CreateUserDTO);
});

export const signOut = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>(
  'users/signout',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
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
  object
>('users/get', async (accessToken) => {
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

  return adaptUserDataToClient({
    ...data[0],
    id: userData.user.id,
  } as unknown as CreateUserDTO);
});

export const uploadFile = createAsyncThunk<
  UploadURLType,
  RcFile,
  {
    rejectValue: string;
  }
>('file/upload', async (file, { rejectWithValue }) => {
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
      return rejectWithValue(response.error.message);
    }

    return {
      id: response.data[0].id,
      name: response.data[0].name,
      fullPath: `${STORAGE}/${response.data[0].name}`,
    } as unknown as UploadURLType;
  } else {
    return data as UploadURLType;
  }
});

export const updateUserFavoritesList = createAsyncThunk<
  string[],
  { albumId: string; userId: string },
  object
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
