import { baseUrl } from '../lib/utils';

/**
 * Fetches all boards with their associated columns
 * @returns {Promise<Array>} Array of boards with their columns
 */
export const fetchBoards = async () => {
  try {
    const response = await fetch(`${baseUrl}/boards`);
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

/**
 * Fetches details of a single board by ID
 * @param {string} boardId - The ID of the board to fetch
 * @returns {Promise<Object>} Board object
 */
export const fetchBoardDetails = async (boardId) => {
  try {
    const response = await fetch(`${baseUrl}/boards/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching board details:', error);
    throw error;
  }
};


/**
 * Creates a new board with optional columns
 * @param {Object} boardData - The board data to create
 * @param {string} boardData.name - The name of the board
 * @param {string} [boardData.description] - Optional description of the board
 * @param {string[]} [boardData.columnNames] - Optional array of column names
 * @returns {Promise<Object>} The created board
 */
export const createBoard = async (boardData) => {
  try {
    const response = await fetch(`${baseUrl}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create board');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

/**
 * Deletes a board by its ID
 * @param {string} boardId - The ID of the board to delete
 * @returns {Promise<Response>} The API response
 */
export const deleteBoard = async (boardId) => {
  try {
    const response = await fetch(`${baseUrl}/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete board');
    }

    return response;
  } catch (error) {
    console.error('Error deleting board:', error);
    throw error;
  }
};

/**
 * Creates a new task for a specific board and column
 * @param {Object} taskData - The task data to create
 * @param {string} taskData.title - The title of the task
 * @param {string} [taskData.description] - Optional description of the task
 * @param {number} taskData.columnId - The ID of the column the task belongs to
 * @param {number} taskData.boardId - The ID of the board the task belongs to
 * @param {Array<{title: string, isCompleted: boolean}>} [taskData.subtasks] - Optional array of subtasks
 * @returns {Promise<Object>} The created task
 */
export const createTask = async ({ title, description, columnId, boardId, subtasks }) => {
  try {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, columnId, subtasks }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}; /**
 * Fetches columns for a single board by ID
 * @param {string} boardId - The ID of the board to fetch columns for
 * @returns {Promise<Array>} Array of column objects
 */
export const fetchBoardColumns = async (boardId) => {
  try {
    const response = await fetch(`${baseUrl}/columns/board/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board columns');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching board columns:', error);
    throw error;
  }
};

/**
 * Updates an existing board
 * @param {string} boardId - The ID of the board to update
 * @param {Object} boardData - The board data to update
 * @param {string} boardData.name - The new name of the board
 * @param {Array<Object>} boardData.columns - The new array of column objects, each with id, name, and boardId
 * @returns {Promise<Object>} The updated board
 */
export const updateBoard = async ({ boardId, boardName, columns }) => {
  try {
    const response = await fetch(`${baseUrl}/boards/${boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: boardName, columns: columns }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update board');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating board:', error);
    throw error;
  }
};
