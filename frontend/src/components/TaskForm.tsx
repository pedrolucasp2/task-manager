import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema } from '../schemas/task.schema';
import type { CreateTaskFormData } from '../schemas/task.schema';
import { Input } from './Input';
import { Button } from './Button';
import { useState } from 'react';
import api from '../services/api';
interface TaskFormProps {
  onTaskCreated: () => void;
}
export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

  async function handleCreateTask(data: CreateTaskFormData) {
    setSubmitError(null);
    try {
      await api.post('/tasks', data);
      reset();
      onTaskCreated();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setSubmitError('Não foi possível criar a tarefa. Tente novamente.');
    }
  }
  return (
    <form
      onSubmit={handleSubmit(handleCreateTask)}
      className="mb-6 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-md"
    >
      <h2 className="mb-4 text-xl font-semibold text-white">Nova Tarefa</h2>
      <div className="flex flex-col gap-3">
        <Input
          label="Título"
          type="text"
          {...register('title')}
          error={errors.title?.message}
        />

        <Input
          label="Descrição"
          type="text"
          {...register('description')}
          error={errors.description?.message}
        />
        {submitError && (
          <span className="text-sm text-red-400">{submitError}</span>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Adicionar Tarefa
        </Button>
      </div>
    </form>
  );
}