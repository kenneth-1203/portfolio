import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  background: grey;
  border-radius: 5px;
  transition: box-shadow 0.5s, opacity 0.5s;
  will-change: transform;
  border: 10px solid white;
  cursor: grab;
  overflow: hidden;
  touch-action: none;

  & > div {
    will-change: transform;
    height: 100%;
    margin: 0vw 0;

    & > * {
      height: 100%;
      background-size: cover;
      background-position: center center;
      margin: 0vw 0;
    }
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
`;
