import store from "../store";
import type { AlbumFormat, UserType } from "./enums";

export type Album = {
  id: string;
  name: string;
  musician: string;
  genres: string[];
  releaseDate: Date;
  qtySongs: number;
  coverImg: string;
  description: string[];
  format: AlbumFormat[];
  isFavorite?: boolean;
};

export type UserData = {
  name: string;
  email: string;
  type: UserType;
  favorites: string[];
}

export type UserSingIn = {
  email: string;
  password: string;
}

export type AppDispatch = typeof store.dispatch;


