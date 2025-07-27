import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../services/tasks';

/**
 * Hook for deleting a task
 * @returns {Object} Mutation object for task deletion
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Invalidate board columns as they contain tasks
      queryClient.invalidateQueries({ queryKey: ['boardColumns'] });
    },
  });
}; 