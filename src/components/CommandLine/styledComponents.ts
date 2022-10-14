import styled from "styled-components";
import { colors } from "../../assets/css/utilities/colors";
import { transparency } from "../../assets/css/utilities/functions";
import {
  Blink,
  Typewriter,
  Loading,
} from "../../assets/css/utilities/animations";
import { mobile, tabletPortrait } from "../../assets/css/utilities/sizes";

export const Container = styled.div`
  ${tabletPortrait} {
    display: block;
    margin: auto 0;
  }
`;

export const InnerContainer = styled.div`
  transition: 1s;
  width: 100%;

  ${tabletPortrait} {
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  height: 14rem;
  border: 1px solid ${transparency(colors.primary, 0.5)};
  backdrop-filter: blur(3px);
  padding: 2rem;
  transition: border-color 0.2s;
  background: linear-gradient(
    150deg,
    rgba(33, 9, 65, 0.2) 50%,
    rgba(70, 59, 120, 0.2) 100%
  );
`;

export const Navbar = styled.div`
  width: 100%;
  height: 2.4rem;
  pointer-events: none;
  user-select: none;
  color: ${transparency(colors.white, 0.5)};
  background: linear-gradient(
    150deg,
    ${transparency(colors.primary, 0.5)},
    ${transparency(colors.secondary, 0.5)}
  );
  transition: background 0.2s;
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
`;

export const NavbarName = styled.span`
  font-size: 1.2rem;
  margin-left: 0.5rem;
`;

export const NavbarItem = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

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

export const Contents = styled.div``;
