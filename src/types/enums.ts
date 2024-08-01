export const AlbumFormat = {
  cd: 'cd',
  vinyl: 'vinyl',
  digital: 'digital',
  cassette: 'cassette',
  other: 'other',
} as const;

export type AlbumFormat = typeof AlbumFormat[keyof typeof AlbumFormat];

const UserType = {
  user: 'user',
  editor: 'editor',
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export const StoreSlice ={
  siteData: 'SITE_DATA',
  siteProcess: 'SITE_PROCESS',
  userData: 'USER_DATA',
} as const;

export type StoreSlice = typeof StoreSlice[keyof typeof StoreSlice];

export const SubmitStatus = {
  still: 'STILL',
  pending: 'PENDING',
  fullfilled: 'FULLFILLED',
  rejected:'REJECTED',
} as const;

export type SubmitStatus = typeof SubmitStatus[keyof typeof SubmitStatus];

export const Sorting = {
  releaseDateIncrease: 'Release: low to high',
  releaseDateDecrease: 'Release: high to low',
} as const;

export type Sorting = typeof Sorting[keyof typeof Sorting];

export const AuthorizationStatus = {
  auth: 'AUTH',
  noAuth: 'NO_AUTH',
  unknown: 'UNKNOWN',
} as const;

export type AuthorizationStatus = typeof AuthorizationStatus[keyof typeof AuthorizationStatus];
