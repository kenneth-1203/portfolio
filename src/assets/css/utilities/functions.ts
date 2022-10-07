import { colors } from "./colors";

export const transparency = (
  color: string = colors.white,
  alpha: number = 1
) => {
  return color.split(")").join(`, ${alpha})`);
};
