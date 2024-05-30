import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/kanban/board-column";
import { TaskDragData } from "@/components/kanban/task-card";
// import crypto from "crypto";

type DraggableData = ColumnDragData | TaskDragData;



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number = 1500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// export function saltAndHashPassword(password: string): string {
//   const salt = crypto.randomBytes(16).toString("hex");
//   const hash = crypto
//     .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
//     .toString(`hex`);
//   return [salt, hash].join("$");
// }




export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}
