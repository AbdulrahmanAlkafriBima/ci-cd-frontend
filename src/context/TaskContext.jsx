import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);

  const openTaskDetailsDialog = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsDialogOpen(true);
  };

  const closeTaskDetailsDialog = () => {
    setSelectedTaskId(null);
    setIsTaskDetailsDialogOpen(false);
  };

  return (
    <TaskContext.Provider value={{
      selectedTaskId,
      isTaskDetailsDialogOpen,
      openTaskDetailsDialog,
      closeTaskDetailsDialog,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 