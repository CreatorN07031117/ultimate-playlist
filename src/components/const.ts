export const AppRoute = {
  Root: '/',
  Login: '/login',
  Register: '/register',
  Favorites: '/favorites',
  Album: '/album',
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
