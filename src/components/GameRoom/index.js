import React from "react";
//import Button from "@material-ui/core/Button";
import { Container, Button, Box } from "@material-ui/core";
import { sizing } from "@material-ui/system";

const GameRoom = () => {
  return (
    <div>
      <h1>Landing</h1>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" width="60%">
          <Box display="flex" flexDirection="row" width="100%">
            <Button variant="outlined" color="secondary" width="100%">
              Game Rules
            </Button>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <Button variant="outlined" color="secondary">
              Start
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default GameRoom;
