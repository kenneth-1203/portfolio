import styled, { keyframes } from "styled-components";

const Typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const Blink = keyframes`
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

const LoadingAnim = keyframes`
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

const ExpandAnim = keyframes`
  0% {
    height: 5rem;
  }
  99% {
    height: 16rem;
  }
  100% {
    height: 100%;
  }
`;

export const Container = styled.div`
  margin: 6rem;
`;

export const Wrapper = styled.div`
  height: 5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  backdrop-filter: blur(3px);
  animation: ${ExpandAnim} 1s forwards;
  animation-delay: 3s;
`;

export const Navbar = styled.div`
  width: 100%;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

export const NavbarName = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-family: Segoe UI, "sans-serif";
  margin-left: 0.5rem;
  pointer-events: none;
`;

export const NavbarItem = styled.span`
  color: rgba(255, 255, 255, 0.5);
  margin-right: 0.5rem;
  pointer-events: none;
`;

export const Blinker = styled.div`
  position: absolute;
  top: 2rem;

  &::before {
    content: "|";
    font-weight: 800;
    animation: ${Blink} .8s 2 forwards;
  }
`;

export const TypingText = styled.p<{ delay: number; line: number }>`
  font-size: 14px;
  height: 18px;
  margin: 0;
  margin-bottom: 4px;
  overflow: hidden;
  word-break: break-all;
  animation: ${Typewriter} 3s steps(420, end) both;
  animation-delay: ${({ delay }) => delay && delay + 0.5}s;
  cursor: text;

  &:nth-child(${({ line }) => line ?? 3}) {
    &::after {
      content: "|";
      font-weight: 800;
      animation: ${Blink} .8s infinite;
    }
  }
`;

export const LoadingText = styled.p`
  color: green;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;
  word-break: break-all;

  &::before {
    content: "";
    animation: ${LoadingAnim} 0.4s infinite 3s;
  }
`;
