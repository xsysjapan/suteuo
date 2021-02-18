import React from "react";
import { connect } from "react-redux";
import {
  Switch,
  Route,
  RouteComponentProps,
  Redirect,
  withRouter,
} from "react-router-dom";
import { ApplicationState, selectors } from "./redux";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import InitUser from "./pages/InitUser";
import Messaging from "./pages/Messaging";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";

type RoutesProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

const Routes = (props: RoutesProps) => {
  const { auth, location } = props;
  if (auth.state === "LOGGED_IN" && !auth.userInfo?.username) {
    if (location.pathname !== "/initialize") {
      return <Redirect to="/initialize" />;
    }
  }
  if (auth.state === "LOGGED_IN" && auth.userInfo?.username) {
    if (location.pathname === "/initialize") {
      return <Redirect to="/" />;
    }
  }
  return (
    <Switch>
      <Route path="/register" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/initialize" component={InitUser} />
      <Route path="/users/:userId" component={UserDetails} />
      <Route path="/messaging" component={Messaging} />
      <Route component={Home} />
    </Switch>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  auth: selectors.getAuthState(state),
});

export default withRouter(connect(mapStateToProps)(Routes));
