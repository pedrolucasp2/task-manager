import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { TaskForm } from "../components/TaskForm";
import { Modal } from "../components/Modal";
import { EditTaskForm } from "../components/EditTaskForm";


interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

export function DashboardPage() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Não foi possível carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta tarefa?")) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Erro ao remover tarefa:", err);
      alert("Não foi possível remover a tarefa.");
    }
  };

  return (
    
    <div className="flex h-full w-full max-w-6xl flex-col rounded-lg bg-gray-900 bg-opacity-80 shadow-xl backdrop-blur-sm">
      <header className="flex flex-shrink-0 items-center justify-between rounded-t-lg bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Meu Painel de Tarefas</h1>
        <Button
          onClick={logout}
          className="w-auto bg-red-600 px-4 py-1 text-sm hover:bg-red-500 focus-visible:outline-red-600"
        >
          Sair
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
 
        <TaskForm onTaskCreated={fetchTasks} />


        <h2 className="mb-4 mt-6 text-xl font-semibold text-white">Minhas Tarefas</h2>
        {isLoading && (
          <p className="text-center text-gray-400">Carregando tarefas...</p>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 md:col-span-2 lg:col-span-3">
                Você ainda não tem tarefas. Crie uma acima!
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col justify-between rounded-lg border border-gray-700 bg-gray-800 p-4 shadow"
                >
                  <div>
                    <h2 className="mb-2 text-xl font-semibold">{task.title}</h2>
                    <p className="mb-3 text-gray-400">{task.description}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        task.status === "pending"
                          ? "bg-yellow-900 text-yellow-300"
                          : task.status === "in-progress"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-green-900 text-green-300"
                      }`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2 border-t border-gray-700 pt-3">
                    <Button
                      onClick={() => handleOpenEditModal(task)}
                      className="w-auto bg-yellow-600 px-3 py-1 text-xs hover:bg-yellow-500 focus-visible:outline-yellow-600"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      className="w-auto bg-red-700 px-3 py-1 text-xs hover:bg-red-600 focus-visible:outline-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Tarefa"
      >
        {taskToEdit && (
          <EditTaskForm
            task={taskToEdit}
            onTaskUpdated={() => {
              handleCloseEditModal();
              fetchTasks();
            }}
            onClose={handleCloseEditModal}
          />
        )}
      </Modal>
    </div>
  );
}