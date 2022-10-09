import { FC, useEffect } from "react";
import { Card } from "../../Card";
import Typography from "../../Typography";
import { Container } from "./styledComponents";

export const About: FC = (): any => {

  useEffect(() => {
    console.log("about");
  }, [])

  return (
    <Container>
      <Card parallax layer={10}>
        <Typography type="sm">About</Typography>
      </Card>
    </Container>
  );
};
