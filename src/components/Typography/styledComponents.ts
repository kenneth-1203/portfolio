import styled from "styled-components";

export const H1 = styled.h1<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
`;

export const H2 = styled.h2<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
`;

export const H3 = styled.h3<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
`;

export const LG = styled.header<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
    font-size: 2rem;
`;

export const MD = styled.p<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
`;

export const SM = styled.small<{ bold?: boolean }>`
    font-weight: ${({ bold }) => bold ? "800" : "initial"};
`;