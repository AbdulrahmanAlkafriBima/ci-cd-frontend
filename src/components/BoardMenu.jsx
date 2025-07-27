import { useState } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteBoardDialog from "./DeleteBoardDialog";
import EditBoardDialog from "./board/EditBoardDialog";
import { useAppState } from "../context/AppStateContext";
import { Trash2, Edit } from "lucide-react";

export default function BoardMenu({ disabled }) {
  const { selectedBoardId } = useAppState();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditBoardClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteBoardClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <DotsVerticalIcon className="h-5 w-5 text-[var(--color-grey)] dark:text-[var(--color-white)]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-[var(--color-info-light)] dark:border-[var(--color-info)]">
          <DropdownMenuItem
            onClick={handleEditBoardClick}
            className="text-[var(--color-grey)] dark:text-[var(--color-grey-light)] cursor-pointer"
            disabled={disabled}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Board
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteBoardClick}
            className="text-[var(--color-accent)] cursor-pointer"
            disabled={disabled}
          >
            <Trash2 className="mr-2 h-4 w-4 text-[var(--color-accent)]" /> Delete Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteBoardDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        boardId={selectedBoardId}
      />

      <EditBoardDialog
        boardId={selectedBoardId}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </div>
  );
} 