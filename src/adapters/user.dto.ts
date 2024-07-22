import { UserType } from "../types/enums";

export class CreateUserDTO {
  email: string;
  email_verified: boolean;
  favorites: string[];
  phone_verified: boolean;
  sub: string;
  userType: UserType;
  username: string;
}
