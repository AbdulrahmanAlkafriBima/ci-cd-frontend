import { Input } from "../ui/input";

export default function TaskFormFields({ register, errors }) {
  return (
    <>
      {/* Task Title */}
      <div>
        <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
          Title
        </label>
        <Input 
          placeholder="e.g. Take coffee break" 
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters"
            }
          })} 
          className="mt-1 dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]" 
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
          Description (Optional)
        </label>
        <Input 
          placeholder="e.g. It's always good to take a break." 
          {...register("description")} 
          className="mt-1 dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]" 
        />
      </div>
    </>
  );
} 