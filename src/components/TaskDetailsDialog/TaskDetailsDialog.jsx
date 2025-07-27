import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";
import { useTask } from "../../context/TaskContext";
import { createPortal } from 'react-dom';
import { useTaskDetails, useBoardColumns, useToggleSubtask, useDeleteTask } from "../../hooks/taskHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function TaskDetailsDialog() {
  const { selectedTaskId, isTaskDetailsDialogOpen, closeTaskDetailsDialog } = useTask();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: task, isLoading: isTaskLoading, error: taskError } = useTaskDetails(selectedTaskId, isTaskDetailsDialogOpen);
  const { data: columns = [], isLoading: isColumnsLoading } = useBoardColumns(task?.boardId);
  const toggleSubtaskMutation = useToggleSubtask(selectedTaskId);
  const deleteTaskMutation = useDeleteTask(closeTaskDetailsDialog);

  const handleToggleSubtaskCompletion = (subtaskId, currentCompletionStatus, subtaskTitle) => {
    if (selectedTaskId) {
      toggleSubtaskMutation.mutate({ subtaskId, isCompleted: !currentCompletionStatus, title: subtaskTitle });
    }
  };

  const handleDeleteTask = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    if (selectedTaskId) {
      deleteTaskMutation.mutate(selectedTaskId);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditTask = () => {
    setIsEditDialogOpen(true);
  };

  const handleTaskUpdated = () => {
    queryClient.invalidateQueries(["taskDetails", selectedTaskId]);
    queryClient.invalidateQueries(["boardColumns"]);
    setIsEditDialogOpen(false);
  };

  if (!isTaskDetailsDialogOpen) return null;

  if (isTaskLoading || isColumnsLoading) {
    return createPortal(
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-white dark:bg-[var(--color-dark-grey-dark)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Loading task details...
          </div>
        </DialogContent>
      </Dialog>,
      document.body
    );
  }

  if (taskError) {
    return createPortal(
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-red-500">
            Error: {taskError.message}
          </div>
        </DialogContent>
      </Dialog>,
      document.body
    );
  }

  if (!task) return createPortal(null, document.body);

  return createPortal(
    <>
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full" showCloseButton={false}>
          <DialogHeader className="flex flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-white)] break-words">
              {task.title}
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]">
                  <MoreVertical className="h-4 w-4 text-[var(--color-info)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-[var(--color-dark-grey-dark)] border border-[var(--color-lines-dark)]">
                <DropdownMenuItem 
                  onClick={handleEditTask} 
                  className="text-[var(--color-text)] dark:text-[var(--color-white)] hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteTask} 
                  className="text-red-500 hover:text-red-600 hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogHeader>

          <DialogDescription className="text-[var(--color-info-light)] mb-4 sm:mb-6 text-sm sm:text-base font-medium leading-6 break-words">
            {task.description}
          </DialogDescription>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] dark:text-[var(--color-white)] mb-2 sm:mb-3">
              Subtasks ({task.subtasks?.filter(st => st.isCompleted).length || 0} of {task.subtasks?.length || 0})
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {task.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3 sm:p-4 bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)] rounded-md"
                >
                  <Checkbox
                    checked={subtask.isCompleted}
                    onCheckedChange={() => handleToggleSubtaskCompletion(subtask.id, subtask.isCompleted, subtask.title)}
                    className="border-[var(--color-lines-dark)] data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]"
                  />
                  <span className={`text-sm sm:text-base ${subtask.isCompleted ? 'line-through text-[var(--color-info)] dark:text-[var(--color-info-light)]' : 'text-[var(--color-text)] dark:text-[var(--color-white)]'}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] dark:text-[var(--color-white)] mb-2 sm:mb-3">
              Current Status
            </h3>
            <Select
              value={task.status}
              onValueChange={(value) => {
                // Handle status change
              }}
            >
              <SelectTrigger className="w-full bg-[var(--color-bg)] dark:bg-[var(--color-dark-grey-dark)] border-[var(--color-lines-dark)] text-[var(--color-text)] dark:text-[var(--color-white)]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem
                    key={column.id}
                    value={column.id}
                    className="text-[var(--color-text)] dark:text-[var(--color-white)]"
                  >
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskTitle={task?.title}
        onConfirmDelete={handleConfirmDeleteTask}
      />

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        taskId={selectedTaskId}
        onTaskUpdated={handleTaskUpdated}
        trigger={<></>}
      />
    </>,
    document.body
  );
} 