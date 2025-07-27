import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useEffect } from "react";

export default function ThemeSwitch({ theme, onThemeChange }) {
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      onThemeChange(savedTheme);
    }
  }, [onThemeChange]);

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    onThemeChange(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="flex items-center gap-2 justify-center mb-2 bg-[var(--color-bg-dark)] dark:bg-[var(--color-very-dark-grey)] p-3 rounded-md">
      <Sun className="w-4 h-4 text-yellow-400" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={handleThemeChange}
        className="data-[state=checked]:bg-[var(--color-primary)]"
      />
      <Moon className="w-4 h-4 text-blue-900 dark:text-blue-400" />
    </div>
  );
} 