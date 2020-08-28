import React from "react";
import { Container, Button, Box } from "@material-ui/core";
import SignIn from "../SignIn";
import { AuthUserContext } from "../Session";
import Rules from "../Rules";

const Lobby = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser ? <WaitingRoom /> : <SignIn />)}
    </AuthUserContext.Consumer>
  </div>
);

const WaitingRoom = () => {
  return (
    <div>
      <h1>WAITING ROOM</h1>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" width="60%">
          <Box display="flex" flexDirection="row" width="100%">
            <Rules />
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
