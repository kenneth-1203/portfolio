import styled, { keyframes } from "styled-components";

const FillBarAnim = keyframes`
  0% {
    width: 0;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
`;

export const MenuContainer = styled.div`
  padding: 2rem 0;
  width: 12rem;
`;

export const Arrow = styled.span`
  font-size: 8px;
  margin-right: 1rem;
`;

export const OptionText = styled.div`
  position: relative;
  padding-bottom: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    font-weight: 800;
    transform: translateX(8px);
  }
`;

export const LoadingBackground = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 10;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: inherit;
  user-select: none;
`;

export const Loader = styled.div`
  width: 10rem;
  display: flex;
  align-items: center;
`;

export const LoadingBar = styled.div`
  width: 0;
  margin-right: auto;
  height: 0.8rem;
  background: white;
  animation: ${FillBarAnim} 2s both 1s;
  animaton-timing-function: ease-out;
`;