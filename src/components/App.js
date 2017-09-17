import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "../components/home_page";
import "../App.css";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    );
  }
}

export default App;
