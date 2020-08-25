import React, { useState } from "react";
import {
  TextField,
  Container,
  Button,
  Box,
  FormControl,
} from "@material-ui/core";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

const Landing = (props) => {
  const [roomId, setRoomId] = useState("");

  async function handleOnNewGame() {
    const roomId = await props.firebase.createRoom();
    props.history.push(`/GameRoom/${roomId}`);
  }

  async function handleOnJoinGame(event) {
    props.history.push(`/GameRoom/${event.value}`);
  }

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
              onClick={handleOnNewGame}
            >
              New Game
            </Button>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <FormControl>
              <TextField
                variant="outlined"
                label="Join Game ID"
                onChange={setRoomId}
              />
              <Button
                type="submit"
                variant="outlined"
                color="secondary"
                onClick={handleOnJoinGame}
                // disabled={isInvalid}
              >
                Join Game
              </Button>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default withRouter(withFirebase(Landing));
