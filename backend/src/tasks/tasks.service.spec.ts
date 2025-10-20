import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UserPayload } from '../auth/types/auth-types';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

const mockTasksRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softRemove: jest.fn(),
};

// Mock usuário
const mockUser: UserPayload = {
  id: 'user-uuid-123',
  email: 'test@example.com',
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks for the given user', async () => {
      const mockTasks: Task[] = [new Task(), new Task()];
      mockTasksRepository.find.mockReturnValue(mockTasks);

      const result = await service.findAll(mockUser);

      expect(result).toEqual(mockTasks);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
    });
  });
  describe('create', () => {
    it('should create and return a new task', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        title: 'Nova Tarefa',
        description: 'Descrição da nova tarefa',
      };
      mockTasksRepository.create.mockReturnValue(createTaskDto);
      mockTasksRepository.save.mockResolvedValue({
        id: 'task-uuid-456',
        ...createTaskDto,
        user: mockUser,
      });

      const result = await service.create(createTaskDto, mockUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: { id: mockUser.id },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result.title).toEqual(createTaskDto.title);
    });
  });
  describe('findOne', () => {
    it('should find and return a task by ID for the correct user', async () => {
      // Arrange
      const mockTask = {
        id: 'task-uuid-789',
        title: 'Tarefa Encontrada',
        user: { id: mockUser.id },
      };
      mockTasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('task-uuid-789', mockUser);

      expect(result).toEqual(mockTask);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-uuid-789', user: { id: mockUser.id } },
      });
    });

    it('should throw a NotFoundException if task is not found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id-inexistente', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('update', () => {
    it('should update and return the task', async () => {
      const existingTask = new Task();
      const updateTaskDto: UpdateTaskDto = { title: 'Título Atualizado' };

      mockTasksRepository.findOne.mockResolvedValue(existingTask);
      mockTasksRepository.save.mockResolvedValue({
        ...existingTask,
        ...updateTaskDto,
      });

      const result = await service.update('task-id', updateTaskDto, mockUser);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-id', user: { id: mockUser.id } },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Título Atualizado' }),
      );
      expect(result.title).toEqual('Título Atualizado');
    });
  });
  describe('remove', () => {
    it('should call softRemove on the repository', async () => {
      const existingTask = new Task();
      mockTasksRepository.findOne.mockResolvedValue(existingTask);
      mockTasksRepository.softRemove.mockResolvedValue(undefined);
      await service.remove('task-id', mockUser);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-id', user: { id: mockUser.id } },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.softRemove).toHaveBeenCalledWith(existingTask);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
    });
  });
});
