import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BoardBody from "./components/BoardBody";
import { TaskProvider } from "./context/TaskContext";
import TaskDetailsDialog from "./components/TaskDetailsDialog/TaskDetailsDialog";
import { useBoards } from "./hooks/boardHooks";

function App() {
  const { data: fetchedBoards, isLoading } = useBoards();
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (fetchedBoards) {
      setBoards(fetchedBoards);
      // Set the first board as selected if none is selected
      if (!selectedBoardId && fetchedBoards.length > 0) {
        setSelectedBoardId(fetchedBoards[0].id);
      }
    }
  }, [fetchedBoards]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  const handleSelectBoard = (id) => {
    setSelectedBoardId(id);
  };

  const handleCreateBoard = (newBoardData) => {
    // TODO: Implement board creation API call
    console.log("Creating new board with data:", newBoardData);
  };

  return (
    <TaskProvider>
      <div
        className={`flex h-screen w-screen bg-light-grey dark:bg-very-dark-grey font-plus-jakarta-sans`}
      >
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={handleSelectBoard}
          onCreateBoard={handleCreateBoard}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
        <div className="flex-1 flex flex-col h-full bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)] min-w-0 overflow-y-auto">
          <Header
            onAddTask={() => alert("Add new task")}
          />
          <main className="flex-1 min-w-0">
            <BoardBody columns={columns} onAddColumn={() => alert("Add new column")} />
          </main>
        </div>
      </div>
      <TaskDetailsDialog />
    </TaskProvider>
  );
}

export default App;
