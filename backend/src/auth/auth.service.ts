import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserWithoutPassword } from './auth-types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //JWT para um usuário autenticado.
  login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>) {
    if (!userData.email) {
      throw new BadRequestException('O e-mail é obrigatório.');
    }
    const existingUser = await this.usersService.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const user = await this.usersService.create(userData);
    return this.login(user);
  }
}
