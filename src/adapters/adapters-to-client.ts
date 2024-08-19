import { CreateUserDTO } from "./user.dto";
import { UserData } from "../types/types";

export function adaptUserDataToClient (user: CreateUserDTO):UserData {
  return {
    name: user.name,
    email: user.email,
    type: user.userType,
    favorites: user.favorites,
  }
}
