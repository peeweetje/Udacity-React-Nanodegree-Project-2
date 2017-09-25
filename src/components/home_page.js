import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchPosts, fetchCategories } from "../actions";
import { List, Header, Grid, Button, Segment, Popup } from "semantic-ui-react";

class HomePage extends Component {
  componentDidMount() {
    this.props.getData();
  }

  render() {
    return (
      <div className="header-section">
        <div>
          <div>
            <Header textAlign="center" color="teal" as="h1">
              Git Talks
            </Header>
          </div>
          <div className="categories">
            <Grid columns={4}>
              {this.props.categories.length > 0 &&
                this.props.categories.map(category => (
                  <Grid.Column key={category.path}>
                    <Link to={`/${category.name}`}>
                      <Button size="tiny" compact basic color="teal">
                        {category.name}
                      </Button>
                    </Link>
                  </Grid.Column>
                ))}
            </Grid>
          </div>
        </div>

        {this.props.posts.length > 0 &&
          this.props.posts.map(post => (
            <List key={post.id} divided relaxed>
              <Segment color="teal" raised>
                <List.Item>
                  <List.Content>
                    <Link to={`/posts/${post.id}`}>
                      <List.Header>{post.title}</List.Header>
                    </Link>
                    <List.Content>Author: {post.author}</List.Content>
                    <List.Content> {post.body}</List.Content>
                    <List.Content>
                      <Timestamp time={post.timestamp / 1000} />
                    </List.Content>
                    <List.Content>votes: {post.voteScore}</List.Content>
                  </List.Content>
                </List.Item>
                <Popup
                  trigger={
                    <Button
                      content="Delete post"
                      compact
                      icon="trash"
                      basic
                      color="red"
                      size="tiny"
                      floated="right"
                    />
                  }
                  content="Are you sure you want to delete this post?!"
                  on="hover"
                />

                <Button compact basic color="teal" size="tiny" floated="right">
                  Edit post
                </Button>
              </Segment>
            </List>
          ))}
        <div className="btn-add">
          <Button compact basic color="teal" size="large">
            Add Post
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.receivePosts,
    categories: state.receiveCategories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () =>
      dispatch(fetchPosts()).then(() => dispatch(fetchCategories()))
    //deletePost: id => dispatch(deletePost(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
