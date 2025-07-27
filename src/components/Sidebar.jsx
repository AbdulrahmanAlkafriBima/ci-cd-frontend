import { useEffect } from "react";
import { ChevronsRight } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { useBoards } from "../hooks/boardHooks";
import BoardList from "./board/BoardList";
import SidebarControls from "./board/SidebarControls";
import BoardSkeleton from "./board/BoardSkeleton";
import ThemeSwitch from "./board/ThemeSwitch";

export default function Sidebar() {
  const { selectedBoardId, handleSelectBoard, onCreateBoard, sidebarOpen, setSidebarOpen, theme, setTheme } = useAppState();
  const { data: boards = [], isLoading, error } = useBoards();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isLoading) {
    return (
      <aside className="w-[260px] relative flex flex-col justify-between bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-r border-[var(--color-info-light)] dark:border-[var(--color-info)]">
        <div className="p-6">
          <BoardSkeleton />
        </div>
        <SidebarControls 
          onHideSidebar={() => setSidebarOpen(false)} 
        />
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-[260px] relative flex flex-col justify-between bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-r border-[var(--color-info-light)] dark:border-[var(--color-info)]">
        <div className="p-6">
          <div className="text-xs font-bold mb-4 tracking-widest text-red-500">
            Error loading boards
          </div>
        </div>
        <SidebarControls 
          onHideSidebar={() => setSidebarOpen(false)} 
        />
      </aside>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 overflow-hidden border-r relative flex flex-col justify-between flex-shrink-0
          ${sidebarOpen ? 'w-[260px]' : 'w-0'}
          bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-[var(--color-info-light)] dark:border-[var(--color-info)]
          hidden md:flex
        `}
      >
        <div>{/* Logo for sidebar */}
          {sidebarOpen && (
            <div className="p-6 h-fit m-0">
              <img src="/path/to/your/logo.png" alt="Company Logo" className="h-8" />
              {/* <h2 className="font-bold text-[var(--color-text)] dark:text-[var(--color-white)] text-2xl">Kanban</h2> */}
            </div>
          )}
          <BoardList 
            boards={boards}
            selectedBoardId={selectedBoardId}
            onSelectBoard={handleSelectBoard}
            onCreateBoard={onCreateBoard}
          />
        </div>
        <div>
          <ThemeSwitch theme={theme} onThemeChange={setTheme} />
          <SidebarControls 
            onHideSidebar={() => setSidebarOpen(false)} 
            />
        </div>
      </aside>
      {/* Show Sidebar Button */}
      {!sidebarOpen && (
        <button
          className="fixed bottom-4 left-0 bg-[var(--color-primary)] dark:bg-[var(--color-primary)] text-white p-4 rounded-r-full hover:bg-[var(--button-bg-hover)] transition-colors z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </>
  );
} 