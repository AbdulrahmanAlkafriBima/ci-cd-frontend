import { Button } from "./ui/button";
import { useBoardColumns, useBoards } from "../hooks/boardHooks";
import { useCreateColumn } from "../hooks/columnHooks";
import { useAppState } from "../context/AppStateContext";
import { useTask } from "../context/TaskContext";
import { columnColors } from "../lib/utils";

export default function BoardBody() {
  const { selectedBoardId } = useAppState();
  const { data: columns, isLoading, error } = useBoardColumns(selectedBoardId);
  const { data: boards = [] } = useBoards();
  const { mutate: createColumn, isPending: isCreatingColumn } = useCreateColumn();
  const { openTaskDetailsDialog } = useTask();

  // Sort columns by creation date (oldest first)
  const sortedColumns = columns ? [...columns].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateA - dateB;
  }) : [];

  const handleAddColumn = () => {
    if (!selectedBoardId) return;

    // Find the next available column number
    let columnNumber = 1;
    while (columns?.some(col => col.name === `New ${columnNumber}`)) {
      columnNumber++;
    }

    createColumn({
      name: `New ${columnNumber}`,
      boardId: selectedBoardId
    });
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 p-6 min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)] animate-pulse overflow-x-auto">
        {/* Skeleton columns */}
        {[...Array(3)].map((_, colIndex) => (
          <div key={colIndex} className="rounded-lg p-4 min-w-[280px] bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
            {/* Skeleton Column Header */}
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
            {/* Skeleton Tasks */}
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, taskIndex) => (
                <div key={taskIndex} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md shadow">
                  <div className="h-4 w-full rounded mb-2 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Skeleton for "+ New Column" */}
        <div className="flex items-center justify-center min-w-[280px] bg-gray-100 dark:bg-[var(--color-surface)] rounded-lg">
          <div className="h-8 w-1/2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)]">
        <div className="text-red-500">
          Error: {error.message || "Failed to load columns."}
        </div>
      </div>
    );
  }

  // Case 1: No boards exist at all
  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)]">
        <div
          className="font-bold mb-8 text-[var(--color-info)] dark:text-[var(--color-info-light)] text-center px-4"
          style={{ fontSize: 18 }}
        >
          You don't have any boards yet. Start by creating a new board from the sidebar.
        </div>
      </div>
    );
  }

  // Case 2: Boards exist but none selected
  if (selectedBoardId === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)]">
        <div
          className="font-bold mb-8 text-[var(--color-info)] dark:text-[var(--color-info-light)] text-center px-4"
          style={{ fontSize: 18 }}
        >
          Choose a board to begin
        </div>
      </div>
    );
  }

  // Case 3: Board selected but no columns
  if (!sortedColumns || sortedColumns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)]">
        <div
          className="font-bold mb-8 text-[var(--color-info)] dark:text-[var(--color-info-light)]"
          style={{ fontSize: 18 }}
        >
          This board is empty. Create a new column to get started.
        </div>
        <Button
          className="rounded-full font-bold text-base px-6 py-3 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)] transition-colors"
          onClick={handleAddColumn}
          disabled={isCreatingColumn}
        >
          {isCreatingColumn ? "Creating..." : "+ Add New Column"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 min-h-[calc(100vh-96px)] bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)] overflow-x-auto">
      {sortedColumns.map((col, index) => (
        <div key={col.id} className="rounded-lg p-4 min-w-[280px] flex-shrink-0">
          {/* Column Header with color dot */}
          <div className="flex items-center mb-3">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: col.color || columnColors[index % columnColors.length] }}
            ></div>
            <div className="font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
              {col.name} ({col.tasks?.length || 0})
            </div>
          </div>
          {/* Render tasks here */}
          <div className="flex flex-col gap-4">
            {col.tasks?.map((task) => (
              <div 
                key={task.id} 
                className="bg-[var(--color-bg)] dark:bg-[var(--color-surface)] p-4 rounded-md shadow hover:cursor-pointer"
                onClick={() => openTaskDetailsDialog(task.id)}
              >
                <div className="font-semibold text-sm mb-1 text-[var(--color-text)] dark:text-[var(--color-text-alt)]">
                  {task.title}
                </div>
                <div className="text-xs text-[var(--color-info)] dark:text-[var(--color-info-light)]">
                  {task.subtasks?.filter(st => st.isCompleted).length || 0} of {task.subtasks?.length || 0} subtasks
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center min-w-[280px] bg-gray-100 dark:bg-[var(--color-surface)] rounded-lg hover:cursor-pointer flex-shrink-0 shadow-none">
        <Button
          className="rounded-full font-bold text-base px-6 py-3 transition-colors text-gray-500 bg-transparent hover:bg-transparent shadow-none"
          onClick={handleAddColumn}
          disabled={isCreatingColumn}
        >
          {isCreatingColumn ? "Creating..." : "+ New Column"}
        </Button>
      </div>
    </div>
  );
} 