import React, { useState } from 'react';
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
        <h1>Landing</h1>
        <Container maxWidth='sm'>
          <Box display='flex' flexDirection='column' width='60%'>
            <Box display='flex' flexDirection='row' width='100%'>
              <Button
                variant='outlined'
                color='secondary'
                width='100%'
                onClick={this.handleNewGame}
              >
                New Game
              </Button>
            </Box>
            <Box display='flex' flexDirection='row' width='100%'>
              <form onSubmit={this.handleJoinGame}>
                <TextField
                  variant='outlined'
                  label='Join Game ID'
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
