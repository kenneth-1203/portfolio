import { keyframes } from "styled-components";

export const Typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

export const Blink = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const Loading = keyframes`
  0% {
    content: "-"
  }
  25% {
    content: "\""
  }
  50% {
    content: "|"
  }
  75% {
    content: "/"
  }
  100% {
    content: "-"
  }
`;

export const ExpandAnim = (from: string, to: string) => keyframes`
  0% {
    height: ${from};
  }
  99% {
    height: ${to};
  }
  100% {
    height: 100%;
  }
`;