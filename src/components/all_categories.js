import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchPostsCategory, fetchComments, fetchDeletePost } from "../actions";
import { Header, Segment, List, Icon, Button } from "semantic-ui-react";

class Categories extends Component {
  componentDidMount() {
    this.props.fetchData(this.props.match.params.category);
  }

  deletePost = postId => {
    console.log("The user clicked  delete button");
    console.log(postId);
    this.props.deletePost(postId);
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
          this.props.posts.filter(post => !post.deleted).map(post => (
            <List className="post" key={post.id}>
              <div className="post-wrapper">
                <Segment color="teal" raised>
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="header">{post.title}</h3>
                  </Link>
                  <List.Content className="author">
                    <Icon name="user" color="teal" size="large" /> author:
                    {post.author}
                  </List.Content>
                  <List.Content className="time">
                    <Icon name="clock" />
                    <Timestamp time={post.timestamp / 1000} />
                  </List.Content>
                  <List.Content className="post-body">{post.body}</List.Content>
                  <List.Content className="votes">
                    Votes: {post.voteScore}
                  </List.Content>
                  <List.Content className="comments" key={post.Id}>
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
                  <Link to="/editpost">
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
                  </Link>
                </Segment>
              </div>
            </List>
          ))
        ) : (
          <div>
            <h3 className="empty-category">
              There are no posts in this category. Do you want to make a new
              post?
            </h3>
          </div>
        )}
        <div className="add-btn-post">
          <Link to="/addpost">
            <Button compact color="teal" size="large" floated="right">
              <Icon name="plus circle" />
              Add Post
            </Button>
          </Link>
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
  fetchPost: postId => dispatch(fetchComments(postId)),
  deletePost: postId => dispatch(fetchDeletePost(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
