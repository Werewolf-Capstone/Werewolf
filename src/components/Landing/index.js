import React from "react";
import { TextField, Container, Button, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import GameRoom from "../GameRoom";
import SignIn from "../SignIn";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const onNewGameClick = () => {
  return (
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? <GameRoom roomId={uuidv4()} /> : <SignIn roomId={uuidv4()} />
      }
    </AuthUserContext.Consumer>
  );
};

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
              onClick={() => onNewGameClick()}
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
