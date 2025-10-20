import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //encontrar um usuario pelo email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  //criar um novo usuario
  async create(userData: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    //entidade de usuario com a senha hasheada
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    //salva usuario no banco de dados
    await this.usersRepository.save(newUser);

    //Retorna usuario sem a senha
    delete newUser.password;
    return newUser;
  }
}
