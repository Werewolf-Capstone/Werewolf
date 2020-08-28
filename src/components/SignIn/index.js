import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";

import { TextField, Container, Button, Box } from "@material-ui/core";

const SignInPage = () => (
  <Container
    display="flex"
    maxWidth="sm"
    // flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <h1>SIGN IN</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </Container>
);

const initialState = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...initialState });
        this.props.history.go(0);
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
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <Container
        display="flex"
        flex-direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={this.onSubmit}>
          <Box display="flex" justifyContent="center" margin="1%">
            <TextField
              name="email"
              value={email}
              variant="outlined"
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
              className="input"
            />
          </Box>
          <Box display="flex" justifyContent="center" margin="1%">
            <TextField
              name="password"
              value={password}
              variant="outlined"
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              className="input"
            />
          </Box>
          <Box display="flex" justifyContent="center" marginTop="5%">
            <Button
              disabled={isInvalid}
              type="submit"
              variant="outlined"
              color="secondary"
              id="button"
            >
              Sign In
            </Button>
          </Box>
          <Box display="flex" justifyContent="center">
            {error && <p className="ptext">{error.message}</p>}
          </Box>
        </form>
      </Container>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export { SignInForm };
