import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTaskById, updateSubtaskCompletion, deleteTask, createTask, updateTask } from "../services/tasks";
import { fetchBoardColumns } from "../services/board";

export const useTaskDetails = (taskId, isDialogOpen) => {
  return useQuery({
    queryKey: ["taskDetails", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: isDialogOpen && !!taskId,
  });
};

export const useBoardColumns = (boardId) => {
  return useQuery({
    queryKey: ["boardColumns", boardId],
    queryFn: () => fetchBoardColumns(boardId),
    enabled: !!boardId,
  });
};

export const useToggleSubtask = (taskId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubtaskCompletion,
    onMutate: async ({ subtaskId, isCompleted }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["taskDetails", taskId] });
      await queryClient.cancelQueries({ queryKey: ["boardColumns"] });

      // Snapshot the previous value
      const previousTaskData = queryClient.getQueryData(["taskDetails", taskId]);
      const previousBoardColumns = queryClient.getQueryData(["boardColumns"]);

      // Optimistically update the task details
      queryClient.setQueryData(["taskDetails", taskId], (old) => {
        if (!old) return old;
        const updatedSubtasks = old.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, isCompleted: !isCompleted } : subtask
        );
        return { ...old, subtasks: updatedSubtasks };
      });

      // Optimistically update the board columns
      queryClient.setQueryData(["boardColumns"], (old) => {
        if (!old) return old;
        return old.map(column => ({
          ...column,
          tasks: column.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === subtaskId ? { ...subtask, isCompleted: !isCompleted } : subtask
                )
              };
            }
            return task;
          })
        }));
      });

      return { previousTaskData, previousBoardColumns };
    },
    onError: (err, newSubtask, context) => {
      // Revert the optimistic updates on error
      queryClient.setQueryData(["taskDetails", taskId], context?.previousTaskData);
      queryClient.setQueryData(["boardColumns"], context?.previousBoardColumns);
      console.error("Error updating subtask completion:", err);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["taskDetails", taskId]);
      queryClient.invalidateQueries(["boardColumns"]);
    },
  });
};

export const useDeleteTask = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["boardColumns"]);
      if (onSuccess) onSuccess();
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["boardColumns"]);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updatedTask }) => updateTask(taskId, updatedTask),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["taskDetails", variables.taskId]);
      queryClient.invalidateQueries(["boardColumns"]);
    },
  });
};