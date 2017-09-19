import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchSinglePost } from "../actions";

class PostDetail extends Component {
  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postId);
  }
  render() {
    return (
      <div>
        <div>
          <h1>Git Talks</h1>
          {this.props.post && (
            <div>
              <h3>{this.props.post.title}</h3>
              <p>{this.props.post.author}</p>
              <p>
                <Timestamp time={this.props.post.timestamp / 1000} />
              </p>
              <p>{this.props.post.body}</p>
              <p>Vote: {this.props.post.voteScore}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.receivePost
});

const mapDispatchToProps = dispatch => ({
  fetchPost: postId => dispatch(fetchSinglePost(postId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
