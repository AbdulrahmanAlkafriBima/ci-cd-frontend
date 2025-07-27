import { Button } from "../ui/button";
import { Grid2x2PlusIcon } from "lucide-react";
import AddBoardDialog from "../AddBoardDialog";

export default function BoardList({ boards, selectedBoardId, onSelectBoard, onCreateBoard, closePopover }) {
  return (
    <div className="">
      <div className="text-xs font-bold mb-4 tracking-widest text-[var(--color-info)] dark:text-[var(--color-info-light)]">
        ALL BOARDS ({boards.length})
      </div>
      <nav className="flex flex-col pl-0">
        {boards.map((board) => (
          <Button
            key={board.id}
            variant="ghost"
            className={`justify-start font-bold text-base px-6 transition-colors ${
              board.id === selectedBoardId
                ? 'relative bg-sidebar-active text-button rounded-r-full rounded-l-none overflow-hidden text-ellipsis whitespace-nowrap after:content-[""] after:absolute after:top-1/2 after:left-[-24px] after:-translate-y-1/2 after:w-12 after:h-12 after:bg-sidebar-active after:rounded-full after:z-10 after:shadow-lg ml-[-24px] w-[calc(100%+24px)] my-0 py-4 hover:bg-[var(--sidebar-active-bg-hover)] after:hover:bg-[var(--sidebar-active-bg-hover)] hover:text-[var(--sidebar-active-text-hover)]'
                : 'text-[var(--color-info)] dark:text-[var(--color-info-light)] rounded-md ml-4 py-4'
            }`}
            onClick={() => {
              onSelectBoard(board.id);
              if (closePopover) {
                closePopover();
              }
            }}
          >
            <span className="mr-3 inline-block">
              <Grid2x2PlusIcon/>
            </span>
            {board.name}
          </Button>
        ))}
        {/* Add New Board Dialog Trigger */}
        <AddBoardDialog
          trigger={
            <Button
              className="rounded-md font-bold text-base px-6 py-4 ml-4 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] bg-transparent dark:bg-transparent hover:bg-[var(--sidebar-active-bg-hover)] hover:text-[var(--sidebar-active-text-hover)]"
            >
              <span>
                <Grid2x2PlusIcon/>
              </span>
              + Create New Board
            </Button>
          }
          onSubmit={onCreateBoard}
        />
      </nav>
    </div>
  );
} 