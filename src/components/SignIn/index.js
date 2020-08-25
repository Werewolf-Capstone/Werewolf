import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";

import { TextField, Container, Button } from "@material-ui/core";

const SignInPage = () => (
  <Container>
    <div>
      <h1>SignIn</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
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
      <Container>
        <form onSubmit={this.onSubmit}>
          <TextField
            name="email"
            value={email}
            variant="outlined"
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <TextField
            name="password"
            value={password}
            variant="outlined"
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <Button
            disabled={isInvalid}
            type="submit"
            variant="outlined"
            color="primary"
          >
            Sign In
          </Button>

          {error && <p>{error.message}</p>}
        </form>
      </Container>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export { SignInForm };
