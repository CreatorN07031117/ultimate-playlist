import { createClient } from '@supabase/supabase-js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Album  } from '../types/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export const fetchAlbums = createAsyncThunk<Album[], undefined, AsyncThunkConfig >(
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

export const fetchAlbumById = createAsyncThunk<Album, string, AsyncThunkConfig>(
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

