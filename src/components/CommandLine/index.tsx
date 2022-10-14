import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  InnerContainer,
  Navbar,
  NavbarName,
  NavbarItem,
  Wrapper,
  Contents,
} from "./styledComponents";
import { Card } from "../Card";

export const CommandLine: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Container>
      <Card parallax>
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
            <Navbar>
              <NavbarName>portfolio</NavbarName>
              <NavbarItem>✖</NavbarItem>
            </Navbar>
            <Wrapper>
              <Card>
                <Contents>{children}</Contents>
              </Card>
            </Wrapper>
          </InnerContainer>
        </motion.div>
      </Card>
    </Container>
  );
};
