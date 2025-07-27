export default function BoardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 bg-[var(--color-surface)] dark:bg-[var(--color-surface-alt)] rounded mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-4 bg-[var(--color-surface)] dark:bg-[var(--color-surface-alt)] rounded" />
            <div className="h-6 flex-1 bg-[var(--color-surface)] dark:bg-[var(--color-surface-alt)] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
} 