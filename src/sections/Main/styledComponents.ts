import styled from "styled-components";
import {
  Blink,
  Typewriter,
  Loading,
} from "../../assets/css/utilities/animations";
import { mobile } from "../../assets/css/utilities/sizes";

export const Blinker = styled.div`
  position: absolute;
  top: 2rem;

  &::before {
    content: "|";
    font-weight: 800;
    animation: ${Blink} 0.8s 2 forwards;
  }
`;

export const TypingText = styled.p<{
  delay: number;
  line: number;
}>`
  font-size: 1.4rem;
  height: 1.4rem;
  margin-bottom: 1rem;
  overflow: hidden;
  word-break: break-all;
  cursor: text;
  transition: 1s;
  user-select: none;

  &:nth-child(${({ line }) => line ?? 3}) {
    &::after {
      content: "|";
      font-weight: 800;
      animation: ${Blink} 0.8s infinite;
    }
  }

  animation: ${Typewriter} 2s steps(420, end) both;
  animation-delay: ${({ delay }) => delay && delay + 0.5}s;

  ${mobile} {
    animation: ${Typewriter} 0.7s steps(420, end) both;
    animation-delay: ${({ delay }) => delay && delay + 0.5}s;
  }
`;

export const LoadingText = styled.p`
  color: green;
  font-size: 1.4rem;
  overflow: hidden;
  word-break: break-all;

  &::before {
    content: "";
    animation: ${Loading} 0.4s infinite 3.5s;
  }
`;
