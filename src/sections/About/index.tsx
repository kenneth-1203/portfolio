import React from "react";
import { Card } from "../../components/Card";
import Typography from "../../components/Typography";
import { Container } from "./styledComponents";

export const About: React.FC = (): any => {
  return (
    <Container>
      <Card parallax layer={10}>
        <Typography type="sm">About</Typography>
      </Card>
    </Container>
  );
};
