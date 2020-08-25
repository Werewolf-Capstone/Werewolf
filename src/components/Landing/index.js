import React from "react";
import { TextField, Container, Button, Box } from "@material-ui/core";

const Landing = () => {
  return (
    <div>
      <h1>Landing</h1>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" width="60%">
          <Box display="flex" flexDirection="row" width="100%">
            <Button
              variant="outlined"
              color="secondary"
              width="100%"
              href="../GameRoom"
            >
              New Game
            </Button>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <TextField variant="outlined" label="Join Game ID" />
            <Button variant="outlined" color="secondary">
              Join Game
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Landing;
