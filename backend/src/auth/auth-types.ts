import { User } from 'src/users/entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;