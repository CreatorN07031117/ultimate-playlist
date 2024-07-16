interface EnvVars {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvVars {}
}