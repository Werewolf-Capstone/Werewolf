/**
 * Handles the transition from night to day by checking if werewolves, seer, and medic all voted; kills off the selected player only if the werewolves' choice is not the same as the medic's choice, and updates the game status
 * @param {*} game - game object gotten from the snapshot of the 'rooms' document
 */

export function handleNightToDay(game) {
  if (game.villagers.length === 1) {
    this.assignRolesAndStartGame(game);
  }
  this.handleWerewolfVote(game); // checks if werewolves have agreed on a vote, and sets in our DB
  this.handleSeer();
  this.handleMedic();
  if (game.checkWerewolf && game.checkSeer && game.checkMedic) {
    if (game.werewolvesChoice === game.medicChoice) {
      game.werewolvesChoice = '';
    } else {
      game.villagers = game.villagers.filter((villager) => {
        return villager !== game.werewolvesChoice;
      });
      if (game.werewolvesChoice !== '') {
        game.dead.push(game.werewolvesChoice);
      }
    }
  } //outer IF
  else {
    return;
  }
  game.Night = false;
  game.medicChoice = '';
  game.votesWerewolves = '';
  game.checkWerewolf = false;
  game.checkMedic = false;
  game.checkSeer = false;
  game.votesWerewolves = [];
  game.villagersChoice = '';
  //updating game state in DB

  this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update(game);

  this.setState({ night: false });
}

/**
 * Handles the transition from day to night by filtering out the player killed, checking if they were a villager or werewolf, resetting all votes, and updating game status
 * @param {*} game - game object gotten from the snapshot of the 'rooms' document
 */

export function handleDayToNight(game) {
  this.handleMajority(game);
  if (game.majorityReached) {
    if (game.villagers.includes(game.villagersChoice)) {
      game.villagers = game.villagers.filter((villager) => {
        return villager !== game.villagersChoice;
      });
    } else {
      game.werewolves = game.werewolves.filter((werewolf) => {
        return werewolf !== game.villagersChoice;
      });
    }
    game.dead.push(game.villagersChoice);
  } //outer IF
  else {
    return;
  }
  game.Night = true;
  // game.villagersChoice = ""
  game.wereWolvesChoice = '';
  game.majorityReached = false;
  game.votesVillagers = [];
  //updating game state in DB

  console.log('DURING DAY, ABOUT TO GO TO NIGHT', game);

  this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update(game);

  this.setState({ night: true });
}

/**
 * Checks for a majority vote on all players killing one person; once found, updates the villagers' choice which will be used to announce the player has been killed when day turns to night.
 * @param {*} game - game object gotten from the snapshot of the 'rooms' document once the game starts
 */
export async function handleMajority(game) {
  //end goal to update villageGers

  const totalPlayers = game.villagers.length + game.werewolves.length;
  let votingObject = {}; //key will be a user, value is how many votes for that user
  // let players = await this.props.firebase.db.collection('rooms').doc(this.state.gameId).data().players

  let players = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();
  let votesVillagers = players.data().votesVillagers;

  for (let player of votesVillagers) {
    // need to add rooms and users tables to state
    if (Object.keys(votingObject).includes(player)) {
      votingObject[player] += 1;
    } else {
      votingObject[player] = 1;
    }
  }
  console.log('in handle majority', votingObject);

  for (let player of Object.keys(votingObject)) {
    if (votingObject[player] > Math.floor(totalPlayers / 2)) {
      this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId)
        .update({ villagersChoice: player, majorityReached: true });
    }
  }
}

/**
 * Handler function which updates a villager's vote based on the user they are choosing to kill
 * @param {*} userPeerId - the user's PeerJS ID (that is, the user a villager is trying to kill)
 */
export async function handleVillagerVoteButton(userPeerId) {
  const userDocId = await this.props.firebase.db
    .collection('users')
    .where('userId', '==', userPeerId)
    .get();

  let votesVillagers = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();

  votesVillagers = votesVillagers.data().votesVillagers;
  votesVillagers.push(userDocId.docs[0].id);

  await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update({ votesVillagers });
}

/**
 * Checks for a majority vote on werewolves killing one person; once found, updates the werewolves' choice which will be used to announce the player has been killed when night turns to day.
 * @param {*} game - game object gotten from the snapshot of the 'rooms' document
 */
export async function handleWerewolfVote(game) {
  let players = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();

  players = players.data().werewolves;
  // ^^^ do we need this code above with 'players' ?

  const totalPlayers = game.werewolves.length;

  let votesWerewolves = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();
  votesWerewolves = votesWerewolves.data().votesWerewolves;

  console.log('what are my villagers', votesWerewolves);

  let votingObject = {};

  for (let player of votesWerewolves) {
    // need to add rooms and users tables to state
    if (Object.keys(votingObject).includes(player)) {
      votingObject[player] += 1;
    } else {
      votingObject[player] = 1;
    }
  }
  console.log('voting object is', votingObject);
  for (let player of Object.keys(votingObject)) {
    if (votingObject[player] > Math.floor(totalPlayers / 2)) {
      // this.props.firebase.db.collection('rooms').doc(this.state.gameId).villagersChoice.update(player) // find real way to do this
      this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId)
        .update({ werewolvesChoice: player, checkWerewolf: true });
    }
  }
}

/**
 * Checks if the seer voted, and (if so) subsequently updates the 'checkSeer' boolean in the 'rooms' database
 */
export async function handleSeer() {
  const player = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();

  const seerChoice = player.data().seerChoice;

  if (seerChoice === '') return;
  else {
    console.log('setting checkSeer to true');
    this.props.firebase.db
      .collection('rooms')
      .doc(this.state.gameId)
      .update({ checkSeer: true });
  }
}

/**
 * Checks if the medic voted, and (if so) subsequently updates the 'checkMedic' boolean in the 'rooms' database
 */
export async function handleMedic() {
  const player = await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .get();

  const medicChoice = player.data().medicChoice;

  if (medicChoice === '') return;
  else {
    console.log('setting checkMedic to true');
    this.props.firebase.db
      .collection('rooms')
      .doc(this.state.gameId)
      .update({ checkMedic: true });
  }
}

/**
 * Randomly assigns roles to users, and subsequently updates the 'gameStarted' boolean in the 'rooms' database
 * @param {*} game - game object gotten from the snapshot of the 'rooms' database once the game starts
 */
export async function assignRolesAndStartGame(game) {
  console.log('In assignRoles');
  let users = await this.props.firebase.db
    .collection('users')
    .where('currentGame', '==', this.state.gameId)
    .get();
  users = users.docs;

  //randomize later
  console.log('what is users in assign roles', users);

  let werewolves = [];

  let villagers = [];

  users.forEach((doc, i) => {
    console.log('what does my user look like', doc.id);
    let user = doc.id;

    if (i < 2) {
      console.log('werewolves are ', werewolves);
      werewolves.push(user);
    }
    if (i === 2) {
      this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId)
        .update({ seer: user });
      villagers.push(user);
    }
    if (i === 3) {
      this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId)
        .update({ medic: user });
      villagers.push(user);
    }
    if (i > 3) {
      villagers.push(user);
    }
  });

  await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update({ werewolves: werewolves });
  await this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update({ villagers: villagers });

  this.props.firebase.db
    .collection('rooms')
    .doc(this.state.gameId)
    .update({ gameStarted: true });
}
