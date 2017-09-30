import React, { Component } from "react";
import { connect } from "react-redux";
//import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchSinglePost, fetchComments, fetchDeletePost } from "../actions";
import { Header, Segment, Button, Icon, List } from "semantic-ui-react";

class PostDetail extends Component {
  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postId);
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
          <Header textAlign="center" color="teal" as="h1">
            Git Talks
          </Header>
          {this.props.post && (
            <div className="post-wrapper">
              <Segment color="teal" raised>
                <h3 className="title">{this.props.post.title}</h3>
                <List.Content>
                  <Icon name="user" color="teal" size="large" /> author:
                  {this.props.post.author}
                </List.Content>
                <List.Content>
                  <Icon name="clock" />
                  <Timestamp time={this.props.post.timestamp / 1000} />
                </List.Content>
                <List.Content>{this.props.post.body}</List.Content>
                <List.Content>Votes: {this.props.post.voteScore}</List.Content>
                <List.Content>
                  comments: ({this.props.comments &&
                    this.props.comments.length})
                </List.Content>

                <Button
                  onClick={() => this.deletePost(this.props.post.id)}
                  compact
                  basic
                  color="red"
                  size="tiny"
                  floated="right"
                >
                  <Icon name="trash" />
                  Delete Post
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
                  Edit Post
                </Button>
              </Segment>
            </div>
          )}

          <div className="comments-wrapper">
            {this.props.comments.length > 0 &&
              this.props.comments.map(comment => (
                <div key={comment.id} className="comment-wrapper">
                  <Segment color="teal" raised>
                    <List.Content>
                      <Icon name="user" color="teal" size="large" /> Author:
                      {comment.author}
                    </List.Content>
                    <List.Content> {comment.body}</List.Content>
                    <List.Content>
                      <Icon name="clock" />
                      <Timestamp time={comment.timestamp / 1000} />
                    </List.Content>

                    <Button
                      compact
                      basic
                      color="red"
                      size="tiny"
                      floated="right"
                    >
                      <Icon name="comments" />
                      delete comment
                    </Button>

                    <Button
                      compact
                      basic
                      color="teal"
                      size="tiny"
                      floated="right"
                    >
                      <Icon name="comments" />
                      Edit comment
                    </Button>
                  </Segment>
                </div>
              ))}
            <div className="btn-add">
              <Button compact basic color="teal" size="large">
                <Icon name="plus circle" />
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.receivePost,
  comments: state.getComments
});

const mapDispatchToProps = dispatch => ({
  fetchPost: postId =>
    dispatch(fetchSinglePost(postId)).then(() =>
      dispatch(fetchComments(postId))
    ),
  deletePost: postId => dispatch(fetchDeletePost(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
