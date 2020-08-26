import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  AppId: process.env.REACT_APP_APP_ID,
  MeasurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // async createRoom2() {
  //   await this.db
  //     .collection("rooms")
  //     .add({})
  //     .then((room) => {
  //       console.log("Room ID in firebase.js: ", room.id);
  //       return room.id;
  //     })
  //     .catch((error) => {
  //       console.error("Error in creating new room: ", error);
  //     });
  // }

  createRoom = async () => {
    const room = await this.db.collection("rooms").add({
      Night: false,
      checkMajority: false,
      checkMedic: false,
      checkSeer: false,
      checkWerewolf: false,
      dead: [],
      gameStarted: false,
      majorityReached: false,
      medic: "",
      medicChoice: "",
      players: ["sentinel"],
      seer: "",
      seerChoice: "",
      villagers: [],
      villagersChoice: "",
      votesVillagers: [],
      votesWerewolves: [],
      werewolves: [],
      werewolvesChoice: ""
    });
    return room.id;
  };

  // *** User API ***
  user = (uid) => this.db.collection("users").doc(`${uid}`);

  //THIS ROUTE WORKS
  users = () => this.db.collection("users").get();
}

export default Firebase;
