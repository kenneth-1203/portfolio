import { colors } from "./colors";

export const transparency = (
  color: string = colors.white,
  alpha: number = 1
) => {
  return color.split(")").join(`, ${alpha})`);
};

export const calcX = (y: number, ly: number) =>
  -(y - ly - window.innerHeight / 2) / 20;

export const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;