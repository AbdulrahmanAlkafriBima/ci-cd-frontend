import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumn } from '../services/column';
import { QUERY_KEYS } from './boardHooks';

/**
 * Hook for creating a new column
 * @returns {Object} Mutation object for column creation
 */
export const useCreateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColumn,
    onSuccess: () => {
      // Invalidate board columns to trigger refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD_COLUMNS] });
    },
  });
}; 