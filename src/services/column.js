import { baseUrl } from '../lib/utils';

/**
 * Creates a new column for a board
 * @param {Object} columnData - The column data to create
 * @param {string} columnData.name - The name of the column
 * @param {number} columnData.boardId - The ID of the board to create the column for
 * @returns {Promise<Object>} The created column
 */
export const createColumn = async ({ name, boardId }) => {
  try {
    const response = await fetch(`${baseUrl}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, boardId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create column');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating column:', error);
    throw error;
  }
}; 