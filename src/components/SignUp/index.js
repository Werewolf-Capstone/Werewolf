import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { TextField, Container, Button, Box } from "@material-ui/core";

const SignUpPage = () => (
  <Container>
    <h1 className="fadeIn animated">SIGN UP</h1>
    <SignUpForm />
  </Container>
);

const initialState = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };
  }

  onSubmit = (event) => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in Firestore
        console.log("authUser", authUser);
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          currentGame: "",
        });
      })
      .then((authUser) => {
        this.setState({ ...initialState });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <form onSubmit={this.onSubmit}>
        <Box display="flex" justifyContent="center" marginTop="1%">
          <TextField
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Username"
            className="input fadeIn animated"
          />
        </Box>
        <Box display="flex" justifyContent="center" marginTop="1%">
          <TextField
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            className="input fadeIn animated"
          />
        </Box>
        <Box display="flex" justifyContent="center" marginTop="1%">
          <TextField
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            className="input fadeIn animated"
          />
        </Box>
        <Box display="flex" justifyContent="center" marginTop="1%">
          <TextField
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
            className="input fadeIn animated"
          />
        </Box>
        <Box display="flex" justifyContent="center" marginTop="5%">
          <Button
            disabled={isInvalid}
            type="submit"
            color="secondary"
            variant="outlined"
          >
            Sign Up
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
          {error && <p className="ptext">{error.message}</p>}
        </Box>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="ptext">
    <Box display="flex" justifyContent="center" className="fadeIn animated">
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </Box>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
