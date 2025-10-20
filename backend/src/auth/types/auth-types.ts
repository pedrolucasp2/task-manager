import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';
export type UserWithoutPassword = Omit<User, 'password'>;
export interface UserPayload {
  id: string;
  email: string;
}
export interface RequestWithUser extends Request {
  user: UserPayload;
}
