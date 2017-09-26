import React, { Component } from "react";
import { connect } from "react-redux";
//import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchSinglePost, fetchComments } from "../actions";
import { Header, Segment, Button, Icon, List } from "semantic-ui-react";

class PostDetail extends Component {
  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postId);
  }
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
                <List.Content>Vote: {this.props.post.voteScore}</List.Content>

                <Button compact basic color="red" size="tiny" floated="right">
                  <Icon name="trash" />
                  deletePost
                </Button>

                <Button compact basic color="teal" size="tiny" floated="right">
                  <Icon name="edit" />
                  Edit post
                </Button>
              </Segment>
            </div>
          )}

          <div className="comment-wrapper">
            {this.props.comments.length > 0 &&
              this.props.comments.map(comment => (
                <Segment color="teal" raised key={comment.id}>
                  <List.Content>
                    <Icon name="user" color="teal" size="large" /> Author:
                    {comment.author}
                  </List.Content>
                  <List.Content> {comment.body}</List.Content>
                  <List.Content>
                    <Icon name="clock" />
                    <Timestamp time={comment.timestamp / 1000} />
                  </List.Content>

                  <Button compact basic color="red" size="tiny" floated="right">
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
              ))}
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
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
