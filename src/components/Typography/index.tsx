import React from "react";
import { H1, H2, H3, LG, MD, SM } from "./styledComponents";

interface PropTypes {
  type?: "h1" | "h2" | "h3" | "lg" | "md" | "sm";
  bold?: boolean;
  children: any;
}

export default function Typography({
  type,
  bold = false,
  children,
}: PropTypes) {
  switch (type) {
    case "h1": {
      return <H1 bold={bold}>{children}</H1>;
    }
    case "h2": {
      return <H2 bold={bold}>{children}</H2>;
    }
    case "h3": {
      return <H3 bold={bold}>{children}</H3>;
    }
    case "lg": {
      return <LG bold={bold}>{children}</LG>;
    }
    case "md": {
      return <MD bold={bold}>{children}</MD>;
    }
    case "sm": {
      return <SM bold={bold}>{children}</SM>;
    }
    default: {
      return <p>{children}</p>;
    }
  }
}
