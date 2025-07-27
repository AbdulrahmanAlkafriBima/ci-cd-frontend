import { baseUrl } from "@/lib/utils";

/**
 * Fetches a task by its ID
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Object>} The task object
 */
export const fetchTaskById = async (taskId) => {
  const response = await fetch(`${baseUrl}/tasks/${taskId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

/**
 * Updates the completion status of a subtask
 * @param {Object} params - The parameters for updating the subtask
 * @param {string} params.subtaskId - The ID of the subtask to update
 * @param {boolean} params.isCompleted - The new completion status
 * @param {string} params.title - The title of the subtask
 * @returns {Promise<Object>} The updated subtask
 */
export const updateSubtaskCompletion = async ({ subtaskId, isCompleted, title }) => {
  const response = await fetch(`${baseUrl}/subtasks/${subtaskId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, isCompleted }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update subtask");
  }
  return response.json();
};

/**
 * Deletes a task by its ID
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
export const deleteTask = async (taskId) => {
  const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
  return true;
};

/**
 * Updates an existing task
 * @param {number} taskId - The ID of the task to update
 * @param {Object} taskData - The updated task data
 * @param {string} taskData.title - The title of the task
 * @param {string} [taskData.description] - Optional description of the task
 * @param {number} taskData.columnId - The ID of the column the task belongs to
 * @param {Array<{id?: number, title: string, isCompleted: boolean}>} [taskData.subtasks] - Optional array of subtasks
 * @returns {Promise<Object>} The updated task
 */
export const updateTask = async (taskId, taskData) => {
  try {
    console.log('Making PUT request to:', `${baseUrl}/tasks/${taskId}`);
    console.log('Request body:', taskData);
    
    const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData?.message || `Failed to update task: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Update task response:', result);
    return result;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Creates a new task
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
};
