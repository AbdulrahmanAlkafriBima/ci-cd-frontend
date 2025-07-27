import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoard } from '../services/board';

/**
 * Hook for deleting a board
 * @returns {Object} Mutation object for board deletion
 */
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      // Invalidate and refetch boards list
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      // Invalidate board columns as they will be affected
      queryClient.invalidateQueries({ queryKey: ['boardColumns'] });
    },
  });
}; 