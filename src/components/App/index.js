import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUp from "../SignUp";
import SignIn from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import Account from "../Account";
import Admin from "../Admin";
import GameRoom from "../GameRoom";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUp} />
      <Route path={ROUTES.SIGN_IN} component={SignIn} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={Account} />
      <Route path={ROUTES.ADMIN} component={Admin} />
      <Route path={ROUTES.GAME_ROOM + "/:roomId"} component={GameRoom} />
    </div>
  </Router>
);

export default withAuthentication(App);
