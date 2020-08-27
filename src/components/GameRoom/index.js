import React from 'react';
import Peer from 'peerjs';
import { Participant } from '../Participant';
import * as firebase from 'firebase';
import { withFirebase } from '../Firebase';
import { addVideoStream, connectToNewUser } from './videoFunctions';
import {
  handleNightToDay,
  handleDayToNight,
  handleMajority,
  handleVillagerVoteButton,
  handleWerewolfVote,
  handleWerewolfVoteButton,
  handleSeer,
  handleMedic,
  assignRolesAndStartGame,
} from './logicFunctions';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ourPeerId: '',
      ourDocId: '',
      gameId: '7xz6yB0zX9QUDlOPzyKZ',
      userStreamArr: [],
      role: '',
      night: true,
      checkWereWolf: false,
      checkSeer: false,
      checkMedic: false,
      didSeerHit: ''
    };

    this.peers = new Set();

    this.connectToNewUser = connectToNewUser.bind(this);
    this.addVideoStream = addVideoStream.bind(this);
    this.handleMajority = handleMajority.bind(this);
    this.handleNightToDay = handleNightToDay.bind(this);
    this.handleDayToNight = handleDayToNight.bind(this);
    this.assignRolesAndStartGame = assignRolesAndStartGame.bind(this);
    this.handleVillagerVoteButton = handleVillagerVoteButton.bind(this);
    this.handleWerewolfVoteButton = handleWerewolfVoteButton.bind(this);
    this.handleWerewolfVote = handleWerewolfVote.bind(this);
    this.handleMedic = handleMedic.bind(this);
    this.handleSeer = handleSeer.bind(this);
  }

  async componentDidMount() {
    const myPeer = new Peer(undefined, {
      host: '/',
      port: '3001',
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.addVideoStream(stream, this.state.ourPeerId);
        myPeer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (userVideoStream) => {
            if (!this.peers.has(call.peer)) {
              this.addVideoStream(userVideoStream, call.peer);
            }
            this.peers.add(call.peer);
          });
        });
        this.props.firebase.db
          .collection('users')
          .onSnapshot(async (snapshot) => {
            let data = snapshot.docs;

            //doc.data().userId is the user's PeerJS ID
            data.forEach((doc) => {
              if (this.state.ourPeerId !== doc.data().userId) {
                this.connectToNewUser(doc.data().userId, stream, myPeer);
              }
            });
          });
        //create firebase method to look up individual game
        this.props.firebase.db
          .collection('rooms')
          .doc(this.state.gameId)
          .onSnapshot(async (snapshot) => {
            let game = snapshot.data();

            if (!game.gameStarted) return;

            if (game.Night) {
              this.handleNightToDay(game);
            } else {
              this.handleDayToNight(game);
            }
          });
      });

    myPeer.on('open', async (id) => {
      this.setState({ ourPeerId: id });

      const user = await this.props.firebase.db
        .collection('users')
        .add({ userId: id, currentGame: this.state.gameId });

      this.setState({ ourDocId: user.id });

      const roomsRef = this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId);
      roomsRef.update({
        players: firebase.firestore.FieldValue.arrayUnion(user.id),
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.userStreamArr.map((userStream) => {
          return (
            <Participant
              //individualParticipantRole needed to customize who sees who instead of all/nothing
              key={this.state.ourDocId}
              userStreamTuple={userStream}
              handleVillagerVoteButton={this.handleVillagerVoteButton}
              handleWerewolfVoteButton={this.handleWerewolfVoteButton}
              ourDocId={this.state.ourDocId}
              night={this.state.night}
              localRole={this.state.role}
              checkWerewolf={this.state.checkWerewolf}
              checkSeer={this.state.checkSeer}
              checkMedic={this.state.checkMedic}
            />
          );
        })}
      </div>
    );
  }
}

export default withFirebase(GameRoom);
