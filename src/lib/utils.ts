import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date) {
  const totalSeconds = Math.floor(
    (date.getTime() - new Date().getTime()) / 1000
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatPrice(price: number) {
  return (price / 100).toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });
}
