import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import crypto from "crypto";

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
