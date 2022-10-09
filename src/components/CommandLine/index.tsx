import { FC, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Navbar,
  NavbarName,
  NavbarItem,
  Container,
  InnerContainer,
  Contents,
  Wrapper,
  Blinker,
  TypingText,
  LoadingText,
} from "./styledComponents";
import { TreeView } from "../TreeView";
import { Card } from "../Card";

interface Code {
  code: string;
  delay: number;
}

const codeSnippets: Array<Code> = [
  {
    delay: 1,
    code: "Hello there,",
  },
  {
    delay: 1,
    code: "my name is Kenneth Kho.",
  },
  {
    delay: 1,
    code: "I'm a Software Engineer.",
  },
];

export const CommandLine: FC = () => {
  const [line, setLine] = useState<number>(3);

  return (
    <Container>
      {/* <Tilt
        perspective={1000}
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        scale={1.03}
        transitionSpeed={5000}
        glareEnable={false}
        onEnter={() => setHovering(true)}
        onLeave={() => setHovering(false)}
      > */}
      <Card parallax layer={1}>
        <motion.div
          animate={{
            y: [100, 0],
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 0.8,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <InnerContainer>
            <Navbar
            // onMouseOver={() => setHovering(true)}
            // onMouseLeave={() => setHovering(false)}
            >
              <NavbarName>portfolio</NavbarName>
              <NavbarItem>✖</NavbarItem>
            </Navbar>
            <Wrapper>
              <Card parallax layer={2}>
                <Contents>
                  {codeSnippets.map((snippet, i) => {
                    return (
                      <Card parallax layer={2} onClick={() => setLine(i + 1)}>
                        <TypingText
                          key={i}
                          delay={snippet.delay + i / 2}
                          line={line}
                        >
                          {snippet.code}
                        </TypingText>
                      </Card>
                    );
                  })}
                  <Blinker />
                  <LoadingText />
                  <TreeView />
                </Contents>
              </Card>
            </Wrapper>
          </InnerContainer>
        </motion.div>
      </Card>
      {/* </Tilt> */}
    </Container>
  );
};
