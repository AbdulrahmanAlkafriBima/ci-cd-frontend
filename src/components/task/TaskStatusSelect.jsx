export default function TaskStatusSelect({ columns, watchedStatus, setValue, selectedColumn }) {
  console.log('TaskStatusSelect - columns:', columns);
  console.log('TaskStatusSelect - watchedStatus:', watchedStatus);
  console.log('TaskStatusSelect - selectedColumn:', selectedColumn);

  // Ensure columns is an array and has the expected structure
  const validColumns = Array.isArray(columns) ? columns : [];
  
  return (
    <div>
      <select
        value={watchedStatus || ''}
        onChange={(e) => setValue('status', e.target.value)}
        className="w-full mt-1 p-2 rounded-md border border-[var(--color-info-light)] dark:border-[var(--color-info)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] text-[var(--color-text)] dark:text-[var(--color-white)]"
      >
        <option value="">Select a column</option>
        {validColumns.map(column => (
          <option key={column.id} value={column.id.toString()}>
            {column.name}
          </option>
        ))}
      </select>
    </div>
  );
} 