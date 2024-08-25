export const ALBUMS_PER_PAGE = 24;

export const DESKTOP_WIDTH = 1200;


export const IMG_UPLOAD_URL = 'https://nfejynuraifmrtmngcaa.supabase.co/storage/v1/object/public/cover_img/';

export const AppRoute = {
  Root: '/',
  Login: '/login',
  Register: '/register',
  Favorites: '/favorites',
  Album: '/album',
  Search: '/search',
  Add: '/add',
  Edit: '/edit',
  NotFound: '/404',
} as const;

export type AppRoute = typeof AppRoute[keyof typeof AppRoute];

export const AuthorizationStatus = {
  Auth: 'AUTH',
  NoAuth: 'NO_AUTH',
  Unknown: 'UNKNOWN',
} as const;

export type AuthorizationStatus = typeof AuthorizationStatus[keyof typeof AuthorizationStatus];


