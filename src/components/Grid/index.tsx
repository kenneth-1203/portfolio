import React from "react";
import { Wrapper } from "./styledComponents";

export const Grid: React.FC<{ children: React.ReactNode, col?: string }> = ({ children, col = "" }) => {
  return <Wrapper col={col}>{children}</Wrapper>;
};
