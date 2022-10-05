import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Navbar,
  NavbarName,
  NavbarItem,
  Container,
  Wrapper,
  Blinker,
  TypingText,
  LoadingText,
} from "./styledComponents";
import { TreeView } from "../TreeView";

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
    <motion.div
      animate={{
        y: [100, 0],
        opacity: [0, 1, 1],
      }}
      transition={{
        delay: .8,
        duration: .5,
        ease: "easeOut"
      }}
    >
      <Container>
        <Navbar>
          <NavbarName>portfolio</NavbarName>
          <NavbarItem>✖</NavbarItem>
        </Navbar>
        <Wrapper>
          {codeSnippets.map((snippet, i) => {
            return (
              <>
                <TypingText
                  key={i}
                  delay={snippet.delay + i / 2}
                  line={line}
                  onClick={() => setLine(i + 1)}
                >
                  {snippet.code}
                </TypingText>
              </>
            );
          })}
          <Blinker />
          <LoadingText />
          <TreeView />
        </Wrapper>
      </Container>
    </motion.div>
  );
};
