import { createClient } from '@supabase/supabase-js';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { adaptUserDataToClient } from '../adapters/adapters-to-client';
import type { Album, UserData  } from '../types/types';
import { CreateUserDTO } from '../adapters/user.dto';
import { RcFile } from 'antd/es/upload';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function getCountRowsInTable(tableName) {
  let { data, error } = await supabase
    .from(tableName)
    .select('COUNT(*)')

  if (error) {
    console.error('Error fetching row count:', error)
    return
  }

  console.log('Number of rows in table:', data[0].count)
}

export const getAlbumsCount = createAsyncThunk<number, undefined>(
  'albums', 
  async () => {
    const { data, error } = await supabase
    .from('albums')
    .select('COUNT(*)')

  if (error) {
    console.error('Error fetching row count:', error)
    return
  }
    console.log(data[0].count)
    return data[0].count as number;
  }
)

export const fetchAlbums = createAsyncThunk<Album[], undefined>(
  'albums/fetch',
  async () => {
    const { data, error } = await supabase
      .from('albums')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
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
      .from('albums')
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
        .from('albums')
        .insert(albumData);

      if (error) {
        throw error; // Используйте throw для возврата ошибки
      }

      return 'success'; // Возвращаем данные, если операция прошла успешно
  }
)

export const deleteAlbum = createAsyncThunk<Album | null, string>(
  'albums/delete',
  async (albumId) => {
    const { data, error } = await supabase
    .from('albums') // Замените 'your_table_name' на имя вашей таблицы
    .delete()
    .eq('id', albumId); // Условие для выбора строки по ID

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
              userType: 'editor',
              favorites: [],
            }
        }});
    
        if (error) {
          throw error;
        }
    
        return adaptUserDataToClient(data.user?.user_metadata as CreateUserDTO);
      }
);

//ToDo: Перенести в типы
type UploadURLType = {
  fullPath: string,
  id: string,
  path: string,
}

export const uploadFile = createAsyncThunk<UploadURLType, RcFile >(
  'file/upload',
  async (file) => {
    const { data, error } = await supabase.storage.from('cover_img').upload(file.name, file, {
      contentType: 'image/jpeg',
    })

  if (error) {
    console.error(error.message)
  } else {
    return data;
  }
  }
)

