import { useState, useEffect } from 'react';
import { fetchBoardColumns } from '../services/board';

export const useColumns = (boardId) => {
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch columns when boardId changes
  useEffect(() => {
    if (!boardId) return;

    const fetchColumns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchBoardColumns(boardId);
        setColumns(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch columns');
        console.error('Error in useColumns:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [boardId]);

  // Function to add a new column
  const addColumn = async (columnData) => {
    try {
      const newColumn = await createColumn(boardId, columnData);
      setColumns(prev => [...prev, newColumn]);
      return newColumn;
    } catch (err) {
      setError(err.message || 'Failed to create column');
      throw err;
    }
  };

  // Function to update a column
  const editColumn = async (columnId, columnData) => {
    try {
      const updatedColumn = await updateColumn(columnId, columnData);
      setColumns(prev => 
        prev.map(col => col.id === columnId ? updatedColumn : col)
      );
      return updatedColumn;
    } catch (err) {
      setError(err.message || 'Failed to update column');
      throw err;
    }
  };

  // Function to remove a column
  const removeColumn = async (columnId) => {
    try {
      await deleteColumn(columnId);
      setColumns(prev => prev.filter(col => col.id !== columnId));
    } catch (err) {
      setError(err.message || 'Failed to delete column');
      throw err;
    }
  };

  return {
    columns,
    isLoading,
    error,
    addColumn,
    editColumn,
    removeColumn,
    refreshColumns: () => {
      if (boardId) {
        fetchBoardColumns(boardId)
          .then(data => setColumns(data))
          .catch(err => setError(err.message || 'Failed to refresh columns'));
      }
    }
  };
}; 