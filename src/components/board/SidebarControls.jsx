import { EyeOff } from "lucide-react";

export default function SidebarControls({ onHideSidebar }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <button
        className="flex items-center gap-2 text-[var(--color-info)] dark:text-[var(--color-info-light)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] text-sm font-bold px-2 py-2 rounded transition-colors w-full justify-center"
        onClick={onHideSidebar}
      >
        <EyeOff className="w-4 h-4" />
        Hide Sidebar
      </button>
    </div>
  );
} 