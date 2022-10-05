import React, { FC, useRef, useState, useEffect } from "react";
import { useSpring, a } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import * as Icons from "./icons";
import { Container, Title, Frame, Content, toggle } from "./styledComponents";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const Tree = React.memo<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    name: string | JSX.Element;
  }
>(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();
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
      <Title style={style}>{name}</Title>
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
        delay: 3.8,
      }}
    >
      <Container>
        <Tree name="Sections" defaultOpen>
          <Tree name="About">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                padding: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "black",
                  borderRadius: 5,
                }}
              />
            </div>
          </Tree>
          <Tree name="Experiences">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                padding: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "black",
                  borderRadius: 5,
                }}
              />
            </div>
          </Tree>
          <Tree name="Skills">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                padding: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "black",
                  borderRadius: 5,
                }}
              />
            </div>
          </Tree>
          <Tree name="Projects">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                padding: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "black",
                  borderRadius: 5,
                }}
              />
            </div>
          </Tree>
          <Tree name="References">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 200,
                padding: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "black",
                  borderRadius: 5,
                }}
              />
            </div>
          </Tree>
        </Tree>
      </Container>
    </motion.div>
  );
};
