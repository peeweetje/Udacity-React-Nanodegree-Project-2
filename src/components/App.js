import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home-page/home_page";
import AllCategories from "./all-categories/all_categories";
import PostDetail from "./post-details/post_detail";
import EditPost from "./edit-post/edit_post";
import EditComment from "./edit-comment/edit_comment";
import AddPost from "./add-post/add_post";

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
