import React, { useCallback } from "react";
import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { config } from "./particlesjs-config";

import { Grid } from "./components/Grid";

import { Main } from "./sections/Main";

const Wrapper = styled.div`
  margin: 2rem;
`;

const Background: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {},
    []
  );

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={config}
    />
  );
};

function App() {
  return (
    <>
      <Background />
      <Wrapper>
        <Grid col={"1-of-2"}>
          <Main />
        </Grid>
        <Grid col={"1-of-2"}>
          <Main />
        </Grid>
      </Wrapper>
    </>
  );
}

export default App;
