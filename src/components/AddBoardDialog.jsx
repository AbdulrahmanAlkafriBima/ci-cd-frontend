import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useCreateBoard } from "../hooks/boardHooks";
import { useAppState } from "../context/AppStateContext";

export default function AddBoardDialog({ trigger }) {
  const { setSelectedBoardId } = useAppState();
  const { mutate: createBoard, isPending, error } = useCreateBoard();
  const [isOpen, setIsOpen] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      columnNames: [{ name: "Todo" }, { name: "Doing" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "columnNames",
  });

  const handleFormSubmit = (data) => {
    // Transform the data to match the API requirements
    const boardData = {
      name: data.name,
      description: data.description,
      columnNames: data.columnNames.map(col => col.name).filter(Boolean),
    };

    createBoard(boardData, {
      onSuccess: (newBoard) => {
        // Select the newly created board
        setSelectedBoardId(newBoard.id);
        // Close the dialog and reset the form
        setIsOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      // Dialog is closing, reset the form
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] w-4/5 mx-auto md:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-white)]">Add New Board</DialogTitle>
          <DialogDescription className="text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Create a new board for your tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
              Board Name
            </label>
            <Input 
              placeholder="e.g. Web Design" 
              {...register("name", { 
                required: "Board name is required",
                minLength: {
                  value: 3,
                  message: "Board name must be at least 3 characters"
                }
              })} 
              className="mt-1 dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
              Description (Optional)
            </label>
            <Input 
              placeholder="e.g. Board for tracking web design tasks" 
              {...register("description")} 
              className="mt-1 dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]" 
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
              Board Columns
            </label>
            <div className="flex flex-col gap-3 mt-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input 
                    {...register(`columnNames.${index}.name`, { 
                      required: "Column name is required",
                      minLength: {
                        value: 2,
                        message: "Column name must be at least 2 characters"
                      }
                    })} 
                    className="dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => remove(index)} 
                    className="text-[var(--color-info)] dark:text-[var(--color-info-light)] hover:text-[var(--color-accent)]"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {errors.columnNames && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.columnNames.message || "Please fill in all column names"}
                </p>
              )}
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => append({ name: "" })} 
              disabled={fields.length >= 5} 
              className="mt-4 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]"
            >
              + Add New Column
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error.message || "Failed to create board. Please try again."}
            </p>
          )}

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-[var(--color-primary)] dark:bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--button-bg-hover)]"
              disabled={isPending}
            >
              {isPending ? "Creating Board..." : "Create New Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 