import React from "react";
//import Button from "@material-ui/core/Button";
import { Container, Button, Box } from "@material-ui/core";
import { sizing } from "@material-ui/system";
import SignIn from "../SignIn";
import { AuthUserContext } from "../Session";
import MaxWidthDialog from "../Rules";

const Lobby = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser ? <GameRoom /> : <SignIn />)}
    </AuthUserContext.Consumer>
  </div>
);

const GameRoom = () => {
  const roomId = Math.floor(Math.random() * 10 + 1);

  return (
    <div>
      <h1>Lobby</h1>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" width="60%">
          <Box display="flex" flexDirection="row" width="100%">
            <MaxWidthDialog />
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <Button variant="outlined" color="secondary" disabled>
              Start
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Lobby;
