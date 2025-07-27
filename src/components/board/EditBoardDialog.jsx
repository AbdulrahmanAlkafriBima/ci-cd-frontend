import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useUpdateBoard, useBoardDetails, QUERY_KEYS } from "../../hooks/boardHooks";
import { useQueryClient } from '@tanstack/react-query';

const EditBoardDialog = ({ boardId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { data: boardDetails, isLoading, isError } = useBoardDetails(boardId);
  const updateBoardMutation = useUpdateBoard();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      boardName: "",
      boardColumns: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "boardColumns",
  });

  useEffect(() => {
    if (boardDetails) {
      reset({
        boardName: boardDetails.name,
        boardColumns: boardDetails.columns.map((column) => ({
          id: column.id,
          name: column.name,
          boardId: boardDetails.id,
        })),
      });
    }
  }, [boardDetails, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
    }
  }, [isOpen, reset, queryClient, boardId]);

  const onSubmit = async (data) => {
    try {
      const columnsToUpdate = data.boardColumns.map((col) => {
        // For new columns (id === 0), only send name and boardId
        if (col.id === 0) {
          return {
            name: col.name,
            boardId: boardId
          };
        }
        // For existing columns, send all data
        return {
          id: col.id,
          name: col.name,
          boardId: boardId,
        };
      });

      await updateBoardMutation.mutateAsync({
        boardId,
        boardName: data.boardName,
        columns: columnsToUpdate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update board:", error);
      // TODO: Display error message to the user
    }
  };

  if (!boardDetails && !isLoading) return null; // Only return null if not loading and no details, handles initial render before fetch

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[var(--color-bg-alt)] w-4/5 mx-auto md:w-full">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>Loading board details...</div>
        ) : isError ? (
          <div>Error loading board details.</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
                Board Name
              </label>
              <Input
                placeholder="e.g. Web Design"
                {...register("boardName", { required: "Board name is required" })}
                className="mt-1 dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]"
              />
              {errors.boardName && <p className="text-red-500 text-xs mt-1">{errors.boardName.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
                Board Columns
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. Todo"
                    {...register(`boardColumns.${index}.name`, { required: "Column name is required" })}
                    className="flex-grow dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="dark:text-[var(--color-info-light)] hover:bg-[var(--color-danger-light)] dark:hover:bg-[var(--color-danger)]"
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ name: "", id: 0, boardId: boardId })}
                className="w-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light-hover)] dark:bg-[var(--color-white)] dark:text-[var(--color-primary)] dark:hover:bg-[var(--color-white-hover)]"
              >
                + Add New Column
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-[var(--color-primary)] dark:bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--button-bg-hover)]"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBoardDialog; 