const AlbumFormat = {
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