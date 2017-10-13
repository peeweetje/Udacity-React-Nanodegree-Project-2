import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import Menu from "./menu";
import SortBy from "./sortBy";
import { fetchPostsCategory, fetchDeletePost, fetchVotePost } from "../actions";
import { Header, Segment, List, Icon, Button } from "semantic-ui-react";

class Categories extends Component {
  componentDidMount() {
    //Fetches the posts for a given category (this.props.match.params.category)
    this.props.fetchData(this.props.match.params.category);
  }

  //Dispatches deletePost action for a given postId, to delete a post.
  deletePost = postId => {
    this.props.deletePost(postId);
  };

  //Dispatches votePost action for a given postId. Option determines upvote/downvote.
  iconThumbsUp = (postId, option) => {
    this.props.votePost(postId, "upVote");
  };

  //Dispatches votePost action for a given postId. Option determines upvote/downvote.
  iconThumbsDown = (postId, option) => {
    this.props.votePost(postId, "downVote");
  };

  render() {
    return (
      <div className="header-section">
        <div className="container">
          <div>
            <Header textAlign="center" color="teal" as="h1">
              Git Talks
            </Header>
            <Menu />
            <SortBy />

            <h3 className="header-categories">
              Category: {this.props.match.params.category}
            </h3>
          </div>
        </div>

        {//Checks if there are posts to display for a category
        //sorts posts, and maps posts to display them.
        this.props.posts.posts && this.props.posts.posts.length > 0 ? (
          this.props.posts.posts
            .filter(post => !post.deleted)
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
            .map(post => (
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
                      <Timestamp time={post.timestamp / 1000} format="full" />
                    </List.Content>
                    <List.Content className="post-body">
                      {post.body}
                    </List.Content>
                    <List.Content className="votes">
                      <Icon
                        name="thumbs up outline"
                        onClick={() => this.iconThumbsUp(post.id, "upVote")}
                        color="teal"
                        size="large"
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
                    <List.Content className="comments" key={post.Id}>
                      <Icon name="comment outline" color="teal" size="large" />
                      {post.comments && post.comments.length}
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
                      Delete post
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
                        Edit post
                      </Button>
                    </Link>
                  </Segment>
                </div>
              </List>
            ))
        ) : (
          //If the are no posts to display:
          <div>
            <h3 className="empty-category">
              There are no posts in this category.
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
  posts: state.receivePosts,
  sort: state.sort
});

const mapDispatchToProps = dispatch => ({
  fetchData: category => dispatch(fetchPostsCategory(category)),
  deletePost: postId => dispatch(fetchDeletePost(postId)),
  votePost: (postId, option) => dispatch(fetchVotePost(postId, option))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
