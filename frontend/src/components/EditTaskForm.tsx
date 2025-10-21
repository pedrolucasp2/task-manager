import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import type { UpdateTaskFormData } from '../schemas/task.schema';
import { Input } from './Input';
import { Button } from './Button';
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'done';
}

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: () => void; 
  onClose: () => void;
}

export function EditTaskForm({ task, onTaskUpdated, onClose }: EditTaskFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }, [task, reset]);


  async function handleUpdateTask(data: UpdateTaskFormData) {
    setSubmitError(null);
    try {
      await api.patch(`/tasks/${task.id}`, data); 
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setSubmitError('Não foi possível atualizar a tarefa. Tente novamente.');
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpdateTask)} className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="font-medium text-gray-300">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="rounded-md border-gray-700 bg-gray-900 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <option value="pending">Pendente</option>
          <option value="in-progress">Em Progresso</option>
          <option value="done">Concluída</option>
        </select>
        {errors.status && <span className="text-sm text-red-400">{errors.status.message}</span>}
      </div>

      {submitError && (
        <span className="text-sm text-red-400">{submitError}</span>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          className="w-auto bg-gray-600 px-4 py-2 text-sm hover:bg-gray-500 focus-visible:outline-gray-600"
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="w-auto px-4 py-2 text-sm">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}