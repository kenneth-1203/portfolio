import React, { FC, useRef, useState, useEffect } from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import * as Icons from "./icons";
import { Container, Title, Frame, Content, toggle } from "./styledComponents";
import { Card } from "../Card";
import { About } from "../Sections/About";

interface SectionsProps {
  name: string;
  Component: FC;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const sections: Array<SectionsProps> = [
  {
    name: "About",
    Component: () => <About />,
  },
  {
    name: "Experiences",
    Component: () => <div></div>,
  },
  {
    name: "Skills",
    Component: () => <div></div>,
  },
  {
    name: "Projects",
    Component: () => <div></div>,
  },
  {
    name: "References",
    Component: () => <div></div>,
  },
];

const Tree = React.memo<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    name: string | JSX.Element;
  }
>(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();

  // Todo: Adjust height based on component final height from props

  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  });

  // @ts-ignore
  const Icon: FC<IntrinsicAttributes> =
    Icons[`${children ? (isOpen ? "Minus" : "Plus") : "Close"}SquareO`];

  return (
    <Frame>
      <Icon
        style={{ ...toggle, opacity: children ? 1 : 0.3 }}
        onClick={() => setOpen(!isOpen)}
      />
      <Title style={style} onClick={() => setOpen(!isOpen)}>
        {name}
      </Title>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? "auto" : height,
        }}
      >
        <a.div ref={ref} style={{ y }} children={children} />
      </Content>
    </Frame>
  );
});

// @ts-ignore
export const TreeView: FC = () => {
  return (
    <motion.div
      animate={{
        opacity: [0, 1],
        x: [100, 0],
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 4.5,
      }}
    >
      <Container>
        <Tree name="Sections" defaultOpen>
          {sections.map(({ name, Component }, i) => (
            <Card key={i} parallax layer={5}>
              <Tree name={name}>
                <Component />
              </Tree>
            </Card>
          ))}
        </Tree>
      </Container>
    </motion.div>
  );
};
