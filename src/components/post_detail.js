import React, { Component } from "react";
import { connect } from "react-redux";
//import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment
} from "../actions";
import { Header, Segment, Button, Icon, List, Form } from "semantic-ui-react";
import uuidv1 from "uuid/v1";

class PostDetail extends Component {
  state = {
    commentAuthor: "",
    commentContent: ""
  };

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

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    console.log(this.state);
  };

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      body: this.state.commentContent,
      author: this.state.commentAuthor,
      parentId: this.props.match.params.postId,
      deleted: false,
      parentDeleted: false,
      voteScore: 1
    };
    console.log(data);
    this.props.addComment(data);
    //this.props.history.push(`/posts/${data.parentId}`);
    console.log(data.parentId);
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
                <List.Content className="author">
                  <Icon name="user" color="teal" size="large" />
                  {this.props.post.author}
                </List.Content>
                <List.Content className="time">
                  <Icon color="teal" name="clock" size="large" />
                  <Timestamp time={this.props.post.timestamp / 1000} />
                </List.Content>
                <List.Content className="post-body">
                  {this.props.post.body}
                </List.Content>
                <List.Content className="votes">
                  Votes: {this.props.post.voteScore}
                </List.Content>
                <List.Content className="comments">
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
                    <List.Content className="author">
                      <Icon name="user" color="teal" size="large" />
                      {comment.author}
                    </List.Content>
                    <List.Content className="time">
                      <Icon color="teal" name="clock" size="large" />
                      <Timestamp
                        format="full"
                        time={comment.timestamp / 1000}
                      />
                    </List.Content>
                    <List.Content className="comment-body">
                      {comment.body}
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

            <Form className="add-comments-form" onSubmit={this.handleSubmit}>
              <h2>Add a Comment</h2>
              <Form.Input
                required
                name="commentAuthor"
                value={this.state.commentAuthor}
                onChange={this.handleInputChange}
                label="Author"
                placeholder="Author"
              />

              <Form.TextArea
                required
                name="commentContent"
                value={this.state.commentContent}
                onChange={this.handleInputChange}
                label="Comment Content"
                placeholder="Add a comment"
                rows={6}
              />
              <Form.Button
                name="form-button-control-public"
                color="teal"
                compact
                size="large"

                //label="Label with htmlFor"
              >
                <Icon name="plus circle" />
                Add Comment
              </Form.Button>
            </Form>
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
  deletePost: postId => dispatch(fetchDeletePost(postId)),
  addComment: comment => dispatch(fetchAddComment(comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
