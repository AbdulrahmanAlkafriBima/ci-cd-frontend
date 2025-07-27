import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useCreateTask } from "@/hooks/taskHooks"
import { useBoardDetails,useBoardColumns } from "@/hooks/boardHooks";
import { useAppState } from "../context/AppStateContext";
import TaskFormFields from "./task/TaskFormFields";
import TaskSubtasksFieldArray from "./task/TaskSubtasksFieldArray";
import TaskStatusSelect from "./task/TaskStatusSelect";

export default function AddTaskDialog({ trigger }) {
  const { selectedBoardId } = useAppState();
  // Fetch board details (if needed for title in future, currently only name is used)
  const { data: boardDetails, isLoading: isBoardDetailsLoading, error: boardDetailsError } = useBoardDetails(selectedBoardId);
  // Fetch columns separately for the status dropdown
  const { data: columns = [], isLoading: isColumnsLoading, error: columnsError } = useBoardColumns(selectedBoardId);
  const { mutate: createTask, isPending: isTaskCreating, error: taskCreationError } = useCreateTask();
  const [isOpen, setIsOpen] = useState(false);

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subtasks: [{ title: "", isCompleted: false }],
      status: "", // Will be set to the first column ID by default if available
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "subtasks",
  });

  const watchedStatus = watch('status');

  // Log columns data when fetched - Keep for debugging if needed
  useEffect(() => {
    if (columns.length > 0) {
      console.log('Fetched columns:', columns);
      console.log('First column ID type:', typeof columns[0].id, 'value:', columns[0].id);
    }
  }, [columns]);

  // Log status value when it changes - Keep for debugging if needed
  useEffect(() => {
    console.log('Watched status changed:', watchedStatus, 'type:', typeof watchedStatus);
  }, [watchedStatus]);

  // Set default status when columns data is loaded and dialog is open
  useEffect(() => {
    if (isOpen && columns.length > 0 && !watchedStatus) {
      setValue('status', columns[0].id.toString());
    }
  }, [isOpen, columns, setValue, watchedStatus]);

  const handleFormSubmit = (data) => {
    if (!selectedBoardId || !data.status) {
      console.error("Board ID or Column ID is missing.");
      return;
    }

    const taskData = {
      title: data.title,
      description: data.description || "",
      columnId: parseInt(data.status),
      boardId: parseInt(selectedBoardId),
      subtasks: data.subtasks
        .filter(sub => sub.title.trim() !== '')
        .map(sub => ({
          title: sub.title,
          isCompleted: false
        }))
    };

    console.log('Submitting task with data:', taskData);

    createTask(taskData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  const isDataLoading = isBoardDetailsLoading || isColumnsLoading;
  const fetchError = boardDetailsError || columnsError;

  // Find the selected column object to display its name
  const selectedColumn = columns.find(col => col.id.toString() === watchedStatus);

  // We handle the disabled state of the trigger button outside this component
  // Show loading or error for board data, or message if no columns/board
  if (isDataLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
          {/* Render the trigger button passed as prop, it will be disabled externally */}
          {trigger}
        </DialogTrigger>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)]">
           <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Loading board details and columns...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (fetchError) {
     return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
          {/* Render the trigger button passed as prop, it will be disabled externally */}
          {trigger}
        </DialogTrigger>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)]">
           <div className="p-6 text-center text-red-500">
            Error loading board details or columns.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // This message case should ideally be handled by disabling the trigger button externally.
  // However, we keep a fallback message inside the dialog just in case.
  if (!selectedBoardId || columns.length === 0) {
     return (
       <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
          {/* Render the trigger button passed as prop, it will be disabled externally */}
          {trigger}
        </DialogTrigger>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)]">
           <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Please select a board with columns to add a task.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* Render the trigger button passed as prop */}
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription className="text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Add a new task to "{boardDetails?.name || 'this board'}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* Use the new components */}
          <TaskFormFields register={register} errors={errors} />

          <TaskSubtasksFieldArray 
            fields={fields} 
            append={append} 
            remove={remove} 
            register={register} 
            errors={errors}
          />

          <TaskStatusSelect 
            columns={columns} 
            watchedStatus={watchedStatus} 
            setValue={setValue} 
            selectedColumn={selectedColumn} 
          />

          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}

          {taskCreationError && (
            <p className="text-sm text-red-500">
              {taskCreationError.message || "Failed to create task. Please try again."}
            </p>
          )}

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-[var(--color-primary)] dark:bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--button-bg-hover)]"
              disabled={isTaskCreating || isDataLoading || fetchError || columns.length === 0}
            >
              {isTaskCreating ? "Creating Task..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 