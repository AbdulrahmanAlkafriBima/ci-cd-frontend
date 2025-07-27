import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/tasks';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, updatedTask }) => updateTask(taskId, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['boards']);
    },
  });
}; 