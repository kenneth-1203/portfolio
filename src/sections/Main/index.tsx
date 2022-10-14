import { useState } from "react";
import { CommandLine } from "../../components/CommandLine";
import {
  TypingText,
  Blinker,
  LoadingText,
} from "./styledComponents";

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

export const Main: React.FC = () => {
  const [line, setLine] = useState<number>(3);

  return (
    <CommandLine>
      {codeSnippets.map((snippet, i) => {
        return (
          <TypingText
            key={i}
            onClick={() => setLine(i + 1)}
            delay={snippet.delay + i / 2}
            line={line}
          >
            {snippet.code}
          </TypingText>
        );
      })}
      <Blinker />
      <LoadingText />
    </CommandLine>
  );
};
