import { createClient } from '@supabase/supabase-js';
import { Album } from './types/types';

const supabaseUrl = 'https://nfejynuraifmrtmngcaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZWp5bnVyYWlmbXJ0bW5nY2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzMzA3OTcsImV4cCI6MjAzNTkwNjc5N30.a-itaS0FsOtMkeXV_vP0q5_kKdBJ8qshjanq8pSuzSg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchData() {
  let { data, error } = await supabase
  .from('albums')
  .select('*')

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Fetched data:', data);
  }
}

export default fetchData;