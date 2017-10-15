import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "../components/home_page";
import AllCategories from "../components/all_categories";
import PostDetail from "../components/post_detail";
import EditPost from "../components/edit_post";
import EditComment from "../components/edit_comment";
import AddPost from "../components/add_post";

import "../App.css";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/addPost" component={AddPost} />>
        <Route exact path="/:category/" component={AllCategories} />
        <Route exact path="/editPost/:postId" component={EditPost} />
        <Route exact path="/editComment/:commentId" component={EditComment} />
        <Route exact path="/:category/:post_id" component={PostDetail} />
      </Switch>
    );
  }
}

export default App;
