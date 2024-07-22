import { createClient } from '@supabase/supabase-js';
import type { Album, UserSingIn, User } from './types/types';

const supabaseUrl = '';
const supabaseAnonKey = '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchData() {
  const { data, error } = await supabase
  .from('albums')
  .select('*')

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    return data as Album[];
  }
}

export async function signUp(email, password) {
  try {
    const { user, error: Error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw Error;

    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
}

export async function addUserData(userId, name) {
  const { data, error } = await supabase
    .from('user_data')
    .insert([
      { user_id: userId, name },
    ]);

  if (error) throw error;

  console.log(data);
}

