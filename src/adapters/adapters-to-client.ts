import { UserType } from "../types/enums";
import { UserData } from "../types/types";

type CreateUserDTO = {
  email: string;
  favorites: string[];
  userType: UserType;
  name: string;
  created_at: string;
  id: string;
}

export function adaptUserDataToClient (user: CreateUserDTO):UserData {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    type: user.userType,
    favorites: user.favorites,
  }
}
