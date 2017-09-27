import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchPostsCategory, fetchComments } from "../actions";
import { Header, Segment, List, Icon, Button } from "semantic-ui-react";

class Categories extends Component {
  componentDidMount() {
    this.props.fetchData(this.props.match.params.category);
  }

  deletePost = postId => {
    console.log("The user clicked  delete button");
    console.log(postId);
  };

  editPost = e => {
    console.log("The user clicked  edit button");
  };

  render() {
    return (
      <div className="header-section">
        <div>
          <div>
            <Header textAlign="center" color="teal" as="h1">
              Git Talks
            </Header>

            <h3 className="header-categories">
              Category: {this.props.match.params.category}
            </h3>
          </div>
        </div>

        {this.props.posts.length > 0 ? (
          this.props.posts.map(post => (
            <div className="post" key={post.id}>
              <div className="post-wrapper">
                <Segment color="teal" raised>
                  <Link to={`/posts/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <List.Content>
                    <Icon name="user" color="teal" size="large" /> author:
                    {post.author}
                  </List.Content>
                  <List.Content>
                    <Icon name="clock" />
                    <Timestamp time={post.timestamp / 1000} />
                  </List.Content>
                  <List.Content>{post.body}</List.Content>
                  <List.Content>Votes: {post.voteScore}</List.Content>
                  <List.Content key={post.Id}>
                    comments: ({this.props.comments &&
                      Object.values(this.props.comments).length})
                  </List.Content>
                  <Button
                    onClick={() => this.deletePost(post.id)}
                    compact
                    basic
                    color="red"
                    size="tiny"
                    floated="right"
                  >
                    <Icon name="trash" />
                    delete post
                  </Button>

                  <Button
                    onClick={this.editPost}
                    compact
                    basic
                    color="teal"
                    size="tiny"
                    floated="right"
                  >
                    <Icon name="edit" />
                    Edit post
                  </Button>
                </Segment>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h3>
              There are no posts in this category. Do you want to make a new
              post?
            </h3>
            <div className="add-btn-post">
              <Button compact basic color="teal" size="large" floated="right">
                <Icon name="plus circle" />
                Add Post
              </Button>
            </div>
          </div>
        )}
        <div className="btn-add">
          <Button compact basic color="teal" size="large">
            <Icon name="plus circle" />
            Add Comment
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.getPostsCategory,
  comments: state.getComments
});

const mapDispatchToProps = dispatch => ({
  fetchData: category => dispatch(fetchPostsCategory(category)),
  fetchPost: postId => dispatch(fetchComments(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
