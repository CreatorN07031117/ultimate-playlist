import type { AlbumFormat, UserType } from "./enums";

export type Album = {
  id: string;
  name: string;
  musician: string;
  genres: string[];
  releasDate: Date;
  qtySongs: number;
  coverImg: string;
  description: string[];
  format: AlbumFormat[];
  isFavorite?: boolean;
};

export type User = {
  name: string;
  type: UserType;
  favorites: string[];
}

