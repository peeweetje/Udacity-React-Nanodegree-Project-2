import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment,
  fetchDeleteComment,
  fetchVoteComment,
  fetchVotePost
} from "../actions";
import Menu from "./menu";
import SortBy from "./sortBy";
import { Header, Segment, Button, Icon, List, Form } from "semantic-ui-react";
import uuidv1 from "uuid/v1";

class PostDetail extends Component {
  state = {
    commentAuthor: "",
    commentContent: ""
  };

  componentDidMount() {
    //Fetches a single post by matches the post_id.
    this.props.fetchPost(this.props.match.params.post_id);
    console.log(this.props.fetchPost(this.props.match.params.post_id));
  }

  deletePost = postId => {
    this.props.deletePost(postId);
  };

  //Dispatches action to delete a comment by commentId, when clicking on delete comment.
  onDeleteComment = commentId => {
    this.props.deleteComment(commentId);
  };

  iconThumbsUp = (postId, option) => {
    this.props.votePost(postId, "upVote");
  };

  iconThumbsDown = (postId, option) => {
    this.props.votePost(postId, "downVote");
  };

  iconThumbsUpComment = (commentId, option) => {
    console.log("up is clicked");
    this.props.voteComment(commentId, "upVote");
  };

  iconThumbsDownComment = (commentId, option) => {
    console.log("down is clicked");
    this.props.voteComment(commentId, "downVote");
  };

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      body: this.state.commentContent,
      author: this.state.commentAuthor,
      parentId: this.props.match.params.post_id,
      deleted: false,
      parentDeleted: false,
      voteScore: 1
    };
    this.props.addComment(data);
    this.setState({
      commentAuthor: "",
      commentContent: ""
    });
  };

  render() {
    const { comments } = this.props.comments;
    return (
      <div className="header-section">
        <div className="container">
          <Header textAlign="center" color="teal" as="h1">
            Git Talks
          </Header>

          <Menu />
          <SortBy />

          {//Check if there is a post, filter to check if the post isn't deleted, check
          //if the post object isn't empty, check if there isn't an error when fetching the post,
          // map to display the post.
          this.props.posts.posts &&
            this.props.posts.posts.length > 0 &&
            this.props.posts.posts
              .filter(
                post =>
                  !post.deleted && Object.keys(post).length > 0 && !post.error
              )
              .map(post => (
                <div key={post.id} className="post-wrapper">
                  <Segment color="teal" raised>
                    <h3 className="title">{post.title}</h3>
                    <List.Content className="author">
                      <Icon name="user" color="teal" size="large" />
                      {post.author}
                    </List.Content>
                    <List.Content className="time">
                      <Icon color="teal" name="clock" size="large" />
                      <Timestamp time={post.timestamp / 1000} format="full" />
                    </List.Content>
                    <List.Content className="post-body">
                      {post.body}
                    </List.Content>
                    <List.Content className="votes">
                      <Icon
                        name="thumbs up outline"
                        color="teal"
                        size="large"
                        onClick={() => this.iconThumbsUp(post.id, "upVote")}
                      />
                      <div className="vote-score">
                        <p className="vote-score-num">{post.voteScore}</p>
                      </div>
                      <Icon
                        name="thumbs down outline"
                        color="red"
                        size="large"
                        onClick={() => this.iconThumbsDown(post.id, "downVote")}
                      />
                    </List.Content>
                    <List.Content className="comments">
                      <Icon name="comment outline" color="teal" size="large" />
                      {comments && comments.length}
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
                      Delete Post
                    </Button>
                    <Link to={`/editpost/${post.id}`}>
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
                    </Link>
                  </Segment>
                </div>
              ))}

          <div className="comments-wrapper">
            {//Check if there is a post, filter deleted post, check if post object isn't empty,
            //then filter comments for deleted comments and deleted parent post, sort comments,
            //and map over comments to display them on the PostDetail page.
            this.props.posts.posts &&
              this.props.posts.posts.length > 0 &&
              this.props.posts.posts.filter(
                post => !post.deleted && Object.keys(post).length > 0
              ).length > 0 &&
              comments &&
              comments
                .filter(comment => !comment.deleted)
                .filter(comment => !comment.parentDeleted)
                .sort((a, b) => {
                  switch (this.props.sort.sort.value) {
                    case "unpopular":
                      return a.voteScore - b.voteScore;
                    case "oldest":
                      return a.timestamp - b.timestamp;
                    case "newest":
                      return b.timestamp - a.timestamp;
                    default:
                      return b.voteScore - a.voteScore;
                  }
                })
                .map(comment => (
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
                      <List.Content className="votes">
                        <Icon
                          name="thumbs up outline"
                          color="teal"
                          size="large"
                          onClick={() =>
                            this.iconThumbsUpComment(comment.id, "upVote")}
                        />
                        <div className="vote-score">
                          <p className="vote-score-num">{comment.voteScore}</p>
                        </div>

                        <Icon
                          name="thumbs down outline"
                          color="red"
                          size="large"
                          onClick={() =>
                            this.iconThumbsDownComment(comment.id, "downVote")}
                        />
                      </List.Content>

                      <Button
                        compact
                        basic
                        color="red"
                        size="tiny"
                        floated="right"
                        onClick={() => this.onDeleteComment(comment.id)}
                      >
                        <Icon name="comments" />
                        Delete comment
                      </Button>

                      <Link to={`/editcomment/${comment.id}`}>
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
                      </Link>
                    </Segment>
                  </div>
                ))}

            {this.props.posts.posts &&
            this.props.posts.posts.length > 0 &&
            this.props.posts.posts.filter(
              post =>
                !post.deleted && Object.keys(post).length > 0 && !post.error
            ).length > 0 ? (
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
                  className="add-comment-btn"
                  name="form-button-control-public"
                  color="teal"
                  compact
                  size="large"
                >
                  <Icon name="plus circle" />
                  Add Comment
                </Form.Button>
              </Form>
            ) : (
              <div className="post-not-found-wrapper">
                <h3 className="post-not-found">Post not found.</h3>
                <Button
                  className="back-btn"
                  color="teal"
                  compact
                  size="large"
                  onClick={() => this.props.history.goBack()}
                >
                  <Icon name="arrow left" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.receivePosts,
  comments: state.getComments,
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  //Fetch single post by postId, then, fetch the comments for that post.
  fetchPost: postId =>
    dispatch(fetchSinglePost(postId)).then(() =>
      dispatch(fetchComments(postId))
    ),
  deletePost: postId => dispatch(fetchDeletePost(postId)),
  addComment: comment => dispatch(fetchAddComment(comment)),
  deleteComment: commentId => dispatch(fetchDeleteComment(commentId)),
  voteComment: (commentId, option) =>
    dispatch(fetchVoteComment(commentId, option)),
  votePost: (postId, option) => dispatch(fetchVotePost(postId, option))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
