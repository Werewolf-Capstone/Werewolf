import React from 'react';
import Peer from 'peerjs';
import { withFirebase } from '../Firebase'


class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myVideo: document.createElement('video'),
      refCounter: 1,
      myPeer: new Peer(undefined, {
        host: '/',
        port: '3001',
      }),
      ourId: '',
      gameId: "R6j4yKwXGM20TO5zayga",
    };
    this.peers = new Set();
    this.videoRef1 = React.createRef();
    this.videoRef2 = React.createRef();
    this.videoRef3 = React.createRef();
    this.connectToNewUser = this.connectToNewUser.bind(this);
    this.addVideoStream = this.addVideoStream.bind(this);
    this.handleMajority = this.handleMajority.bind(this);
    this.handleNightTransition = this.handleNightTransition.bind(this);
    this.handleDayTransition = this.handleDayTransition.bind(this);
    this.assignRolesAndStartGame = this.assignRolesAndStartGame.bind(this)

    this.handleWerewolfVote = this.handleWerewolfVote.bind(this)
    this.handleMedic =  this.handleMedic.bind(this)
    this.handleSeer = this.handleSeer.bind(this)
  }
  async componentDidMount() {

    const data = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()

    console.log(data.data())

  


    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.addVideoStream(this.state.myVideo, stream);
        this.state.myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            if (!this.peers.has(call.peer)) {
              this.addVideoStream(video, userVideoStream);
            }
            this.peers.add(call.peer);
          });
        });
        this.props.firebase.db.collection('users').onSnapshot(async (snapshot) => {
          let data = snapshot.docs;
          data.map((doc) => {
            if (this.state.ourId !== doc.data().userId) {
              this.connectToNewUser(doc.data().userId, stream);
            }
          });
        });
        //create firebase method to look up individual game
        console.log("what is our game ID", this.state.gameId)
        this.props.firebase.db.collection('rooms').doc(this.state.gameId).onSnapshot(async (snapshot) => {
          let game = snapshot.data();
          
          if(!game.gameStarted) return

          if (game.Night) {
            this.handleNightTransition(game, this.state.ourId)
          } else {
            this.handleDayTransition(game, this.state.ourId)
          }
        })
      });
    this.state.myPeer.on('open', (id) => {
      this.setState({ ourId: id });
      this.props.firebase.db.collection('users').add({ userId: id, currentGame: this.state.gameId });
    });
  }
  connectToNewUser(userId, stream) {
    const call = this.state.myPeer.call(userId, stream);
    if (!call) {
      return;
    }
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      if (userId !== this.state.ourId) {
        if (!this.peers.has(call.peer)) {
          this.addVideoStream(video, userVideoStream);
        }
      }
    });
    call.on('close', () => {
      video.remove();
    });
  }
  addVideoStream(video, stream) {
    if (this.state.refCounter === 1) {
      this.videoRef1.current.srcObject = stream;
      this.setState({ refCounter: this.state.refCounter + 1 });
    } else if (this.state.refCounter === 2) {
      this.videoRef2.current.srcObject = stream;
      this.setState({ refCounter: this.state.refCounter + 1 });
    } else if (this.state.refCounter === 3) {
      this.videoRef3.current.srcObject = stream;
      this.setState({ refCounter: this.state.refCounter + 1 });
    }
  }
  handleNightTransition(game, ourId) {
    if (game.villagers.length === 1){
      this.assignRolesAndStartGame(game)
    }
    this.handleWerewolfVote(game) // checks if werewolves have agreed on a vote, and sets in our DB
    this.handleSeer()
    this.handleMedic()
    if (game.checkWerewolf && game.checkSeer && game.checkMedic) {
      if (game.werewolvesChoice === game.medicChoice){
        game.werewolvesChoice = ""
      } else {
        game.villagers = game.villagers.filter(villager => {
          return villager !== game.werewolvesChoice
        })
        game.dead.push(game.werewolvesChoice)
        
      }
    } //outer IF
    else {
      return
    }
    game.Night = false
    game.medicChoice = ""
    game.votesWerewolves = ""
    game.checkWerewolf = false
    game.checkMedic = false
    game.checkSeer = false
    game.votesWerewolves = []
    game.villagersChoice = ""
    //updating game state in DB

    console.log("DURING NIGHT, ABOUT TO GO TO DAY", game)
    this.props.firebase.db.collection('rooms').doc(this.state.gameId).update(game)
  }

  handleDayTransition(game, ourId) {
    this.handleMajority(game)
    if (game.majorityReached){
      if (game.villagers.includes(game.villagersChoice)){
        game.villagers = game.villagers.filter(villager => {
          return villager !== game.villagersChoice
        })
      } else {
        game.werewolves = game.werewolves.filter(werewolf => {
          return werewolf !== game.villagersChoice
        })
      }
      game.dead.push(game.villagersChoice)
    } //outer IF
    else {
      return
    }
    game.Night = true
    game.villagersChoice = ""
    game.wereWolvesChoice = ""
    game.majorityReached = false
    game.votesVillagers = []
    //updating game state in DB

    console.log("DURING DAY, ABOUT TO GO TO NIGHT", game)

    this.props.firebase.db.collection('rooms').doc(this.state.gameId).update(game)
  }
  async handleWerewolfVote(game){
    let players = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()

    players = players.data().werewolves

    const totalPlayers = game.werewolves.length

    let votesWerewolves = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()
    votesWerewolves = votesWerewolves.data().votesWerewolves 

    console.log("what are my villagers", votesWerewolves)

    let votingObject = {}
    

    for(let player of votesWerewolves){ // need to add rooms and users tables to state
      if(Object.keys(votingObject).includes(player)){
        votingObject[player]+=1
      }
      else{
        votingObject[player]=1
      }
    }
    console.log("voting object is", votingObject)
    for(let player of Object.keys(votingObject)){
      if (votingObject[player] > Math.floor(totalPlayers / 2)){
        // db.collection('rooms').doc(this.state.gameId).villagersChoice.update(player) // find real way to do this
        this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({werewolvesChoice: player,checkWerewolf: true})
      }
    } 
  }
  async handleSeer(){

    const player = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()

    const seerChoice = player.data().seerChoice

    if(seerChoice === "") return
    else{
      console.log("setting seerCheck to true")
      this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({checkSeer: true})
    }
  }
  async handleMedic(){

    const player = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()

    const medicChoice = player.data().medicChoice

    if(medicChoice === "") return
    else{
      console.log("setting seerCheck to true")
      this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({checkMedic: true})
    }
  }
  

  async handleMajority(game) { //end goal to update villageGers

    const totalPlayers = game.villagers.length + game.werewolves.length
    let votingObject = {} //key will be a user, value is how many votes for that user
    // let players = await db.collection('rooms').doc(this.state.gameId).data().players

    let players = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).get()
    let votesVillagers= players.data().votesVillagers

    for(let player of votesVillagers){ // need to add rooms and users tables to state
      if(Object.keys(votingObject).includes(player)){
        votingObject[player]+=1
      }
      else{
        votingObject[player]=1
      }
    }
    console.log("in handle majority", votingObject)

    for(let player of Object.keys(votingObject)){
      if (votingObject[player] > Math.floor(totalPlayers / 2)){
        // db.collection('rooms').doc(this.state.gameId).villagersChoice.update(player) // find real way to do this
        this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({villagersChoice: player,majorityReached: true}) 
      }
    } 
  }
  handleClick(e){
    this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({gameStarted: true}) 
  }
  async assignRolesAndStartGame(game){
    console.log("In assignRoles")
    let users = await this.props.firebase.db.collection('users').where("currentGame", "==", this.state.gameId).get()
    users = users.docs
    
    //randomize later
    console.log("what is users in assign roles", users)


    let werewolves = []
    
    let villagers = []
    

    // for(let i = 0;i < users.length;i++){
    //   if(i<2){
    //     console.log("werewolves are ", werewolves)
    //     werewolves.push(users[i])
    //   }
    //   if(i == 3){
    //     db.collection('rooms').doc(this.state.gameId).update({seer: users[i]})
    //     villagers.push(users[i])
    //   }
    //   if(i == 4){
    //     db.collection('rooms').doc(this.state.gameId).update({medic: users[i]})
    //     villagers.push(users[i])
    //   }
    //   if(i > 4){
    //     villagers.push(users[i])
    //   }
    // }
    users.map((doc,i) => {
      console.log("what does my user look like", doc.id)
      let user = doc.id

      if(i<2){
        console.log("werewolves are ", werewolves)
        werewolves.push(user)
      }
      if(i == 2){
        this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({seer: user})
        villagers.push(user)
      }
      if(i == 3){
        this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({medic: user})
        villagers.push(user)
      }
      if(i > 3){
        villagers.push(user)
      }


    })
    console.log("what is the ww object we are pushing", werewolves)
    await this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({werewolves: werewolves}) 
    await this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({villagers: villagers}) 

    this.props.firebase.db.collection('rooms').doc(this.state.gameId).update({gameStarted: true}) 





  }
  render() {
    return (
      <div>
        <video ref={this.videoRef1} autoPlay={true} muted />
        <video ref={this.videoRef2} autoPlay={true} muted />
        <video ref={this.videoRef3} autoPlay={true} muted />
        <button onClick={() => {this.handleClick()}}> Start game</button>
      </div>
    );
  }
}

export default withFirebase(GameRoom);
// myPeer.on("call", (call) => {
//   // console.log("do we make it here, if so STREAM IS", stream);
//   // console.log("do we make it here, if so CALL  IS", call.on);
//   console.log("stream is ", stream)
//   call.answer(stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//       console.log(" ARE WE MKAING IT INTO THE STREAM HANDLER")
//     addVideoStream(video, userVideoStream);
//   });
// });
// // console.log("what is stream in useEffect", stream)
// socket.on('user-connected', userId => {
//   connectToNewUser(userId, stream)
// })
// 24
// // 33
// // roomUserInfo = db.collection('users').doc(`${roomId}`);
//   socket.on('user-disconnected', userId => {
//     if (peers[userId]) peers[userId].close()
//   })