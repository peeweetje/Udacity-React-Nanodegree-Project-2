import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "../components/home_page";
import AllCategories from "../components/all_categories";
import PostDetail from "../components/post_detail";

import "../App.css";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/:category" component={AllCategories} />
        <Route exact path="/posts/:postId" component={PostDetail} />
      </Switch>
    );
  }
}

export default App;
