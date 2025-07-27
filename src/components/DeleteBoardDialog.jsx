import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function DeleteBoardDialog({
  isOpen,
  onClose,
  onConfirmDelete,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[var(--color-bg-alt)] border-none w-4/5 mx-auto md:w-full">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-500">Delete this board?</DialogTitle>
          <DialogDescription className="text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Are you sure you want to delete this board? This action will remove all
            columns and tasks and cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row gap-2 justify-center">
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="md:w-1/2 lg:w-[49%] lg:mx-auto w-full rounded-full font-bold bg-[var(--color-accent)] text-[var(--color-white)] hover:bg-[var(--color-accent-light)] dark:hover:bg-[var(--color-accent-light)]"
          >
            Delete
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="md:w-1/2 lg:w-[49%] lg:mx-auto w-full rounded-full font-bold bg-[var(--color-surface)] text-[var(--color-text)] dark:bg-[var(--color-surface)] dark:text-[var(--color-white)] hover:bg-[var(--color-surface-alt)] dark:hover:bg-[var(--color-surface-alt)]"
          >
            Cancel
          </Button>
        </DialogFooter>
        <DialogClose asChild>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 