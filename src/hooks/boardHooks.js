import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, fetchBoardDetails, createBoard, deleteBoard, updateBoard, fetchBoardColumns } from '../services/board';

// Simple string keys
export const QUERY_KEYS = {
  BOARDS: 'boards',
  BOARD_COLUMNS: 'boardColumns',
  BOARD_TASKS: 'boardTasks',
  BOARD_DETAILS: 'boardDetails'
};

/**
 * Hook to fetch all boards
 * @returns {Object} Query result containing boards data and loading/error states
 */
export const useBoards = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOARDS],
    queryFn: fetchBoards,
    staleTime: 0
  });
};

/**
 * Hook to fetch details of a single board by ID
 * @param {string} boardId - The ID of the board to fetch
 * @returns {Object} Query result containing board data and loading/error states
 */
export const useBoardDetails = (boardId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOARDS, boardId],
    queryFn: () => fetchBoardDetails(boardId),
    enabled: !!boardId,
    staleTime: 0
  });
};

/**
 * Hook to fetch columns for a board
 * @param {string} boardId - The ID of the board to fetch columns for
 * @returns {Object} Query result containing columns data and loading/error states
 */
export const useBoardColumns = (boardId) => {
  console.log('useBoardColumns - boardId:', boardId);
  return useQuery({
    queryKey: [QUERY_KEYS.BOARD_COLUMNS, boardId],
    queryFn: () => {
      console.log('useBoardColumns - fetching columns for boardId:', boardId);
      return fetchBoardColumns(boardId);
    },
    enabled: !!boardId,
    staleTime: 0
  });
};

/**
 * Hook to create a new board
 * @returns {Object} Mutation object for creating a board
 */
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Invalidate boards list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
    },
  });
};

/**
 * Hook to update an existing board
 * @returns {Object} Mutation object for updating a board
 */
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoard,
    onSuccess: () => {
      // Invalidate boards list and board details to trigger refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD_COLUMNS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD_DETAILS] });
    },
  });
}; 