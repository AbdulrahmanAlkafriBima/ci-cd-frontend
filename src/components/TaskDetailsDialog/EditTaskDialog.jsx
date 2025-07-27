import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useBoardColumns } from "../../hooks/boardHooks";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskById, updateTask } from "../../services/tasks";
import { useUpdateTask } from "../../hooks/taskHooks";
import { useAppState } from "../../context/AppStateContext";

import TaskFormFields from "../task/TaskFormFields";
import TaskSubtasksFieldArray from "../task/TaskSubtasksFieldArray";
import TaskStatusSelect from "../task/TaskStatusSelect";

export default function EditTaskDialog({ taskId, isOpen, onOpenChange, onTaskUpdated }) {
  const { selectedBoardId } = useAppState();
  const { data: task, isLoading: isTaskLoading, error: taskError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: isOpen && !!taskId,
  });

  const { mutate: updateTaskMutation, isLoading: isUpdatingTask } = useUpdateTask();
  const { data: columns = [], isLoading: isColumnsLoading, error: columnsError } = useBoardColumns(selectedBoardId);

  console.log('EditTaskDialog - task:', task);
  console.log('EditTaskDialog - columns:', columns);
  console.log('EditTaskDialog - selectedBoardId:', selectedBoardId);

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subtasks: [{ title: "", isCompleted: false }],
      status: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "subtasks",
  });

  const watchedStatus = watch('status');

  useEffect(() => {
    if (isOpen && task) {
      reset({
        title: task.title,
        description: task.description,
        subtasks: task.subtasks.map(sub => ({ 
          id: sub.id,
          title: sub.title, 
          isCompleted: sub.isCompleted 
        })),
        status: task.columnId,
      });
    } else if (!isOpen) {
      reset();
    }
  }, [isOpen, task, reset]);

  const handleFormSubmit = async (data) => {
    if (!taskId || !data.status) {
      console.error("Task ID or Column ID is missing.");
      return;
    }

    try {
      const updatedTaskData = {
        title: data.title,
        description: data.description || "",
        columnId: parseInt(data.status),
        subtasks: data.subtasks
          .filter(sub => sub.title.trim() !== '')
          .map(sub => ({
            id: sub.id,
            title: sub.title,
            isCompleted: sub.isCompleted
          }))
      };

      console.log('Sending task update with data:', updatedTaskData);
      
      const result = await updateTaskMutation({ taskId, updatedTask: updatedTaskData });
      console.log('Task update result:', result);
      
      onTaskUpdated && onTaskUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update task. Full error:", error);
      if (error.response) {
        console.error("Error response:", await error.response.text());
      }
    }
  };

  const isDataLoading = isTaskLoading || isColumnsLoading || isUpdatingTask;
  const fetchError = taskError || columnsError;
  const selectedColumn = columns.find(col => col.id.toString() === watchedStatus);

  if (isDataLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-[var(--color-dark-grey-dark)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Loading task details and columns...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (fetchError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-[var(--color-dark-grey-dark)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-red-500">
            Error loading task details or columns.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Task not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--color-bg)] w-4/5 mx-auto md:w-full dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-white)]">
            Edit Task
          </DialogTitle>
          <DialogDescription className="text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Edit task "{task.title}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
          <TaskFormFields register={register} errors={errors} />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text)] dark:text-[var(--color-white)]">
              Subtasks
            </h3>
            <TaskSubtasksFieldArray 
              fields={fields} 
              append={append} 
              remove={remove} 
              register={register} 
              errors={errors}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text)] dark:text-[var(--color-white)]">
              Status
            </h3>
            <TaskStatusSelect 
              columns={columns} 
              watchedStatus={watchedStatus} 
              setValue={setValue} 
              selectedColumn={selectedColumn} 
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-[var(--color-primary)] hover:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={isDataLoading || fetchError}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 