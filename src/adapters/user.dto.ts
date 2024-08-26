import { UserType } from "../types/enums";

export type CreateUserDTO = {
  email: string;
  favorites: string[];
  userType: UserType;
  name: string;
  created_at: string;
  id: string;
}
