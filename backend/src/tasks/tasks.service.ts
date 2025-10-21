import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
//import { User } from 'src/users/entities/user.entity';
import { UserPayload } from 'src/auth/types/auth-types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  //criar uma tarefa nova
  create(createTaskDto: CreateTaskDto, user: UserPayload): Promise<Task> {
    const newTask = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: user.id },
    });
    return this.tasksRepository.save(newTask);
  }
  //Ver todas as MINHAS tarefas
  findAll(user: UserPayload): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: user.id } },
    });
  }
  // Encontra a tarefa do usuario(desde que esteja logado)
  async findOne(id: string, user: UserPayload): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID "${id}" não encontrada.`);
    }
    return task;
  }
  //att tarefa
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: UserPayload,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    const updatedTask = Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(updatedTask);
  }
  //Remover uma tarefa
  async remove(id: string, user: UserPayload): Promise<void> {
    const task = await this.findOne(id, user);
    await this.tasksRepository.softRemove(task);
  }
}
