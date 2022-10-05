import React, { FC, useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { config } from "../../particlesjs-config";
import { CommandLine } from "../CommandLine";

export const Main: FC = () => {
  return (
    <>
      <Background />
      <CommandLine />
      {/* <MenuSelection /> */}
    </>
  );
};

const Background: FC = () => {
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
