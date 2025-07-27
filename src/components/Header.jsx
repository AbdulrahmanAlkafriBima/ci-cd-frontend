import { Button } from "./ui/button";
import AddTaskDialog from "./AddTaskDialog";
import BoardMenu from "./BoardMenu";
import { useAppState } from "../context/AppStateContext";
import { useBoardColumns, useBoards } from "../hooks/boardHooks";
import { useDeleteBoard } from "../hooks/useDeleteBoard";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import BoardList from "./board/BoardList";
import { useState } from "react";
import ThemeSwitch from "./board/ThemeSwitch";

export default function Header() {
  const { selectedBoardId, sidebarOpen, boards, setBoards, setSelectedBoardId, handleSelectBoard, onCreateBoard, theme, setTheme, selectedBoard } = useAppState();
  const { data: columns, isLoading: isColumnsLoading } = useBoardColumns(selectedBoardId);
  const deleteBoardMutation = useDeleteBoard();
  const { data: allBoards = [], isLoading: isBoardsLoading } = useBoards();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const boardTitle = selectedBoard?.name || "Board";

  const handleEditBoard = (data) => {
    if (!boards) return;
    const updatedBoards = boards.map(board => 
      board.id === selectedBoardId 
        ? { ...board, name: data.boardName }
        : board
    );
    setBoards(updatedBoards);
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardMutation.mutateAsync(selectedBoardId);
      
      if (!boards) {
        throw new Error('Boards data is not available');
      }

      const updatedBoards = boards.filter(board => board.id !== selectedBoardId);
      setBoards(updatedBoards);
      
      // Select the first available board after deletion
      const nextBoardId = updatedBoards[0]?.id || null;
      setSelectedBoardId(nextBoardId);
    } catch (error) {
      console.error('Failed to delete board:', error);
      alert('Failed to delete board. Please try again.');
      throw error; // Re-throw to be caught by BoardMenu
    }
  };

  // Determine if the Add Task button should be disabled
  const isAddTaskDisabled = isColumnsLoading || !columns || columns?.length === 0;

  return (
    <header
      className="flex items-center justify-between px-8 py-6 border-b bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-[var(--color-info-light)] dark:border-[var(--color-info)]"
      style={{ minHeight: 80 }}
    >
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <div className="p-2 w-full border-r hidden md:block">
            <img src="/path/to/your/logo.png" alt="Company Logo" className="h-8" />
          </div>
        )}
        <h1
          className="font-bold text-[var(--color-text)] dark:text-[var(--color-white)] hidden md:block"
          style={{ fontSize: "var(--heading-xl-size)" }}
        >
          {boardTitle}
        </h1>

        {/* Mobile Board Selector */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild className="md:hidden">
            <div className="flex items-center gap-2 cursor-pointer">
              {!sidebarOpen && (
                <img src="/path/to/your/logo.png" alt="Company Logo" className="h-6" />
              )}
              <h1
                className="font-bold text-[var(--color-text)] dark:text-[var(--color-white)]"
                style={{ fontSize: "var(--heading-xl-size)" }}
              >
                {boardTitle}
              </h1>
              {isPopoverOpen ? <ChevronsUp className="w-fit h-6 text-[var(--color-primary)]" /> : <ChevronsDown className="w-fit h-6 text-[var(--color-primary)]" />}
            </div>
          </PopoverTrigger>
          <PopoverContent className="mt-4 p-0 md:hidden max-w-xs bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] rounded-lg shadow-md">
            <div className="p-0">
              <div className="text-xs font-bold mb-4 tracking-widest text-[var(--color-info)] px-6 pt-4">
                ALL BOARDS ({allBoards.length})
              </div>
              {isBoardsLoading ? (
                <p className="text-[var(--color-text)]">Loading boards...</p>
              ) : (
                <BoardList
                  boards={allBoards}
                  selectedBoardId={selectedBoardId}
                  onSelectBoard={handleSelectBoard}
                  onCreateBoard={onCreateBoard}
                  closePopover={() => setIsPopoverOpen(false)}
                />
              )}
              <ThemeSwitch theme={theme} onThemeChange={setTheme} />
            </div>
          </PopoverContent>
        </Popover>

      </div>
      <div className="flex items-center gap-4">
        <AddTaskDialog
          trigger={
            <Button
              className="rounded-full font-bold text-base px-6 py-3 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)] transition-colors"
              disabled={isAddTaskDisabled}
            >
              + Add New Task
            </Button>
          }
        />
        <BoardMenu 
          boardTitle={boardTitle}
          onEditBoard={handleEditBoard}
          onDeleteBoard={handleDeleteBoard}
          disabled={!selectedBoardId}
        />
      </div>
    </header>
  );
}