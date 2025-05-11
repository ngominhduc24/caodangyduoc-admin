import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeParseTags(input: unknown): string[] {
  if (typeof input === "string" && input.trim()) {
    try {
      return JSON.parse(input)
    } catch {
      return []
    }
  }
  if (Array.isArray(input)) return input as string[]
  return []
}