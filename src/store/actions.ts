import { createClient } from '@supabase/supabase-js';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Album  } from '../types/types';

const SUPABASE_URL = 'https://nfejynuraifmrtmngcaa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZWp5bnVyYWlmbXJ0bW5nY2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzMzA3OTcsImV4cCI6MjAzNTkwNjc5N30.a-itaS0FsOtMkeXV_vP0q5_kKdBJ8qshjanq8pSuzSg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchAlbums = createAsyncThunk<Album[], undefined >(
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

