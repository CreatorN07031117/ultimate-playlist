import { UserType } from "../types/enums";

export class CreateUserDTO {
  email: string;
  favorites: string[];
  userType: UserType;
  name: string;
  created_at: string;
  id: string;
}
