import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, "O título não pode ser vazio.").optional(),
  description: z.string().min(1, "A descrição não pode ser vazia.").optional(),
  status: z.enum(["pending", "in-progress", "done"]).optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
