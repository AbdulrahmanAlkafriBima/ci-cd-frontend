import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export default function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  taskTitle,
  onConfirmDelete,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--color-bg)] w-4/5 mx-auto dark:bg-[var(--color-bg-alt)] p-4 sm:p-6 rounded-lg shadow-lg max-w-md md:w-full border-none">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-lg sm:text-xl text-red-600 dark:text-red-500 font-bold">
            Delete this task?
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[var(--color-info)] dark:text-[var(--color-info-light)] mt-2 sm:mt-3">
            Are you sure you want to delete the '{taskTitle}' task? This action will remove the task
            and its subtasks and cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row gap-2 justify-center">
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            className="md:w-1/2 lg:w-[49%] lg:mx-auto w-full rounded-full bg-[var(--color-accent)] text-[var(--color-white)] hover:bg-[var(--color-accent-light)] dark:hover:bg-[var(--color-accent-light)]"
          >
            Delete
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="md:w-1/2 lg:w-[49%] lg:mx-auto rounded-full bg-[var(--color-surface)] text-[var(--color-text)] dark:bg-[var(--color-surface)] dark:text-[var(--color-white)] hover:bg-[var(--color-surface-alt)] dark:hover:bg-[var(--color-surface-alt)]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 