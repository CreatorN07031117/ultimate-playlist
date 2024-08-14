import { createClient } from '@supabase/supabase-js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RcFile } from 'antd/es/upload';

import { adaptUserDataToClient } from '../adapters/adapters-to-client';
import type { Album, UserData  } from '../types/types';
import { CreateUserDTO } from '../adapters/user.dto';
import { ALBUMS_PER_PAGE } from '../const';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ALBUMS_TABLE = 'albums';
const STORAGE = 'cover_img';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export const getAlbumsCount = createAsyncThunk<number, void, AsyncThunkConfig>(
  'albums', 
  async () => {
    const response = await supabase
    .from(ALBUMS_TABLE)
    .select('*', { count: 'exact', head: true });

  if (response.error) {
    console.error('Error fetching row count:', response.error)
    return
  }
    return response.count;
  }
)

interface FetchAlbumsArgs {
  pageNumber: number;
  sortingType?: string;
}

export const fetchAlbumsForPage = createAsyncThunk<Album[], FetchAlbumsArgs>(
  'albums/fetch',
  async ({ pageNumber = 1, sortingType }: FetchAlbumsArgs) => {
    const start = (pageNumber - 1) * ALBUMS_PER_PAGE;
    const end = start + ALBUMS_PER_PAGE - 1;

    let query = supabase
      .from(ALBUMS_TABLE)
      .select('*')
      .range(start, end);

    if (sortingType !== "") {
      query = query.order('releaseDate', { ascending: sortingType === 'early' });
    }

    const { data, error } = await query;

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
      const { data, error } = await supabase.rpc('get_unique_genres')

      if (error) throw error;

      return data.map(row => row.genre); 

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

export const addAlbum = createAsyncThunk<string, Album>(
  'albums/add',
  async (albumData: Album) => {
      const { data, error } = await supabase
        .from(ALBUMS_TABLE)
        .insert(albumData);

      if (error) {
        throw error;
      }

      return 'success';
  }
)

export const updateAlbum = createAsyncThunk<Album, {albumData: Album, id: string}>(
  'albums/update',
  async ({ albumData, id }) => {
    const { data, error } = await supabase
      .from(ALBUMS_TABLE)
      .update({ ...albumData })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  }
)

export const fetchFilteredAlbums = createAsyncThunk<{
  albums: Album[],
  rows: number,
  filters: string,
}, {genre:string, pageNumber:number}>(
  'albums/filtered',
  async ({ genre, pageNumber = 1 }) => {
    const start = (pageNumber - 1) * ALBUMS_PER_PAGE;
    const end = start + ALBUMS_PER_PAGE - 1;
      const response = await supabase
      .from(ALBUMS_TABLE)
      .select('*', { count: 'exact'})
      .contains('genres', [genre])
      .range(start, end)
 
        console.log(response.data)
      if (response.error) {
        throw response.error;
      }

      return {
        rows: response.count,
        albums: response.data as Album[],
        filters: genre
      };
  }
);

export const deleteAlbum = createAsyncThunk<Album | null, string>(
  'albums/delete',
  async (albumId) => {
    const { data, error } = await supabase
    .from(ALBUMS_TABLE)
    .delete()
    .eq('id', albumId);

  if (error) {
    console.error('Ошибка при удалении:', error);
    return null;
  }

  return data;
});

export const registerUser = createAsyncThunk<UserData, {email: string, password: string, name: string}>(
  'users/signUp',
  async ({email, password, name}) => {
        const { data, error} = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: name,
              userType: 'user',
              favorites: [],
            }
        }});
    
        if (error) {
          throw error;
        }
    
        return adaptUserDataToClient(data.user?.user_metadata as CreateUserDTO);
      }
);

export const signIn = createAsyncThunk<UserData, {email: string, password: string}>(
  'users/signIn',
  async ({email, password}) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error('Ошибка при входе:', error.message);
      return null;
    }
  
    console.log('Успешный вход:', data);
    return data;
  }
)

//ToDo: Перенести в типы
type UploadURLType = {
  fullPath: string,
  id: string,
  path: string,
}

export const uploadFile = createAsyncThunk<UploadURLType, RcFile >(
  'file/upload',
  async (file) => {
    const { data, error } = await supabase.storage.from(STORAGE).upload(file.name, file, {
      contentType: 'image/jpeg',
    })

  if (error) {
    console.error(error.message)
  } else {
    return data;
  }
  }
)

