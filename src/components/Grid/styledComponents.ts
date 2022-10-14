import styled from "styled-components";

export const Wrapper = styled.div<{ col: string }>`
  float: left;

  &:not(:last-child) {
    margin-right: 2rem;
  }

  ${({ col }) =>
    col === "1-of-2"
      ? `
      width: calc((100% - 2rem) / 2);
    `
      : col === "1-of-3"
      ? `
      width: calc((100% - 2 * 2rem) / 3);
    `
      : col === "2-of-3"
      ? `
      width: calc(
        2 * ((100% - 2 * 2rem) / 3) + 2rem
      );
    `
      : col === "1-of-4"
      ? `
      width: calc((100% - 3 * 2rem) / 4);
    `
      : col === "2-of-4"
      ? `
      width: calc(
        2 * ((100% - 3 * 2rem) / 4) + 2rem
      );
    `
      : col === "3-of-4"
      ? `
      width: calc(
        3 * ((100% - 3 * 2rem) / 4) + 2 * 2rem
      );
    `
      : `
    width: 100%;
  `}
`;
