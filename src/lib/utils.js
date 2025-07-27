import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const baseUrl = 'http://localhost:8080/api/v1';

export const columnColors = [
  '#49C4E5', // Light blue
  '#8471F2', // Purple
  '#67E2AE', // Green
  '#F5C466', // Orange
  '#FF6347', // Tomato
  '#9370DB', // Medium Purple
  '#20B2AA', // Light Sea Green
  '#FF69B4', // Hot Pink
  '#FFD700', // Gold
  '#32CD32', // Lime Green
  '#FF4500', // Orange Red
  '#4169E1', // Royal Blue
  '#8A2BE2', // Blue Violet
  '#FF8C00', // Dark Orange
  '#00CED1', // Dark Turquoise
  '#FF1493', // Deep Pink
  '#00FF7F', // Spring Green
  '#BA55D3', // Medium Orchid
  '#FFA07A', // Light Salmon
  '#7B68EE', // Medium Slate Blue
];