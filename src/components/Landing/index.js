import React from "react";
import { TextField, Container, Button, Box } from "@material-ui/core";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: "",
    };
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  async handleNewGame() {
    const roomId = await this.props.firebase.createRoom();
    this.props.history.push(`/WaitingRoom/${roomId}`);
  }

  handleOnChange = (event) => {
    this.setState({
      roomId: event.target.value,
    });
  };

  // should we do error checking for rooms that don't exist when entering full URL manually?
  async handleJoinGame(event) {
    this.props.history.push(`/WaitingRoom/${this.state.roomId}`);
  }

  render() {
    return (
      <div>
        <Container
          id="landing-page-container"
          display="flex"
          maxWidth="sm"
          flexDirection="column"
          justifyContent="center"
        >
          <Box
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <h1 id="werewolf-title" className="fadeInDown animated">
              WEREWOLF
            </h1>
          </Box>
          <Box
            id="landing-page-buttons-box"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            // alignItems="stretch"
            width="100%"
            // margin="50%"
          >
            <Box
              id="new-game-button-box"
              display="flex"
              flexDirection="column"
              width="100%"
              // justifyContent="right"
              alignItems="center"
              marginTop="20%"
              marginBottom="15%"
            >
              <Button
                variant="outlined"
                color="secondary"
                // height="100%"
                // width="100%"
                // justifyContent="center"
                size="large"
                onClick={this.handleNewGame}
                className="fadeIn3 animated"
              >
                New Game
              </Button>
            </Box>

            <Container
              justifyContent="center"
              display="flex"
              flex-direction="column"
            >
              <form onSubmit={this.handleJoinGame}>
                <Box
                  id="join-game-button-box"
                  display="flex"
                  // flexDirection="row"
                  // height="100%"
                  // width="100%"
                  alignItems="center"
                  justifyContent="center"
                  className="fadeIn3 animated"
                >
                  <TextField
                    id="join-game-textfield"
                    variant="filled"
                    label="Join Game ID"
                    color="secondary"
                    value={this.state.roomId}
                    onChange={this.handleOnChange}
                    className="input fadeIn3 animated"
                  />
                </Box>
                <Box display="flex" justifyContent="center" paddingTop="2%">
                  <Button
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    className="fadeIn3 animated"
                  >
                    Join Game
                  </Button>
                </Box>
              </form>
            </Container>
          </Box>
        </Container>
      </div>
    );
  }
}

export default withRouter(withFirebase(Landing));
