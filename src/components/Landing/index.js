import React from 'react';
import { TextField, Container, Button, Box } from '@material-ui/core';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
    };
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  async handleNewGame() {
    const roomId = await this.props.firebase.createRoom();
    this.props.history.push(`/GameRoom/${roomId}`);
  }

  handleOnChange = (event) => {
    this.setState({
      roomId: event.target.value,
    });
  };

  // should we do error checking for rooms that don't exist when entering full URL manually?
  async handleJoinGame(event) {
    this.props.history.push(`/GameRoom/${this.state.roomId}`);
  }

  render() {
    return (
      <div>
        <Container id='landing-page-container' display='flex' maxWidth='sm'>
          <Box
            display='flex'
            width='100%'
            justifyContent='center'
            alignItems='center'
          >
            <h1 id='werewolf-title'>Werewolf</h1>
          </Box>
          <Box
            id='landing-page-buttons-box'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='stretch'
            width='100%'
            margin='50%'
          >
            <Box
              id='new-game-button-box'
              display='flex'
              flexDirection='row'
              width='100%'
              justifyContent='center'
              alignItems='center'
              margin='5%'
            >
              <Button
                variant='outlined'
                color='secondary'
                height='100%'
                width='100%'
                onClick={this.handleNewGame}
              >
                New Game
              </Button>
            </Box>
            <Box
              id='join-game-button-box'
              display='flex'
              flexDirection='row'
              height='100%'
              width='100%'
              alignItems='center'
            >
              <form onSubmit={this.handleJoinGame}>
                <TextField
                  id='join-game-textfield'
                  variant='filled'
                  label='Join Game ID'
                  color='secondary'
                  value={this.state.roomId}
                  onChange={this.handleOnChange}
                />
                <Button type='submit' variant='outlined' color='secondary'>
                  Join Game
                </Button>
              </form>
            </Box>
          </Box>
        </Container>
      </div>
    );
  }
}

export default withRouter(withFirebase(Landing));
