import React, { Component } from "react";
import { connect } from "react-redux";
//import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchSinglePost, fetchComments } from "../actions";
import { Header, Segment } from "semantic-ui-react";

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
                <p> author: {this.props.post.author}</p>
                <p>
                  <Timestamp time={this.props.post.timestamp / 1000} />
                </p>
                <p>{this.props.post.body}</p>
                <p>Vote: {this.props.post.voteScore}</p>
              </Segment>
            </div>
          )}

          <div className="comment-wrapper">
            {this.props.comments.length > 0 &&
              this.props.comments.map(comment => (
                <Segment color="teal" raised key={comment.id}>
                  <p>Author: {comment.author}</p>
                  <p> {comment.body}</p>
                  <p>
                    <Timestamp time={comment.timestamp / 1000} />
                  </p>
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
