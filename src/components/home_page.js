import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import Menu from "./menu";
import SideBar from "./sideBar";
import * as actions from "../actions";
import {
  List,
  Header,
  Button,
  Segment,
  Icon,
  Responsive
} from "semantic-ui-react";

class HomePage extends Component {
  componentDidMount() {
    //fetch posts to display on Home Page
    this.props.fetchPosts();
  }

  //dispatch delete action, when clicking on delete button
  deletePost = postId => {
    this.props.fetchDeletePost(postId);
  };

  //dispatch vote action, when clicking on upvote, option determines upvote or downvote for action.
  iconThumbsUp = (postId, option) => {
    this.props.fetchVotePost(postId, "upVote");
  };

  //dispatch vote action when clicking on downvote, option determines upvote/downvote.
  iconThumbsDown = (postId, option) => {
    this.props.fetchVotePost(postId, "downVote");
  };

  render() {
    const { posts } = this.props.posts;
    const { sort } = this.props.sort;
    return (
      <div className="page-wrapper">
        <SideBar />
        <div className="content-wrapper">
          <div className="container">
            <div className="header-section">
              <Header textAlign="center" color="teal" as="h1">
                Git Talks
              </Header>
            </div>
            <Menu />
          </div>

          <div className="post-container">
            {/*Check if posts exist, then filter over the posts, sort the posts,
          and map over the posts, to display them on the HomePage*/
            posts &&
              posts.length > 0 &&
              posts
                .filter(post => !post.deleted)
                .sort((a, b) => {
                  switch (sort.value) {
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
                  <List key={post.id} divided relaxed>
                    <Segment color="teal" raised>
                      <List.Item>
                        <List.Content>
                          <Link to={`/${post.category}/${post.id}`}>
                            <List.Header>{post.title}</List.Header>
                          </Link>
                          <List.Content className="author">
                            <Icon name="user" color="teal" size="large" />
                            {post.author}
                          </List.Content>
                          <List.Content className="time">
                            <Icon name="clock" color="teal" size="large" />
                            <Timestamp
                              time={post.timestamp / 1000}
                              format="full"
                            />
                          </List.Content>
                          <List.Content className="votes">
                            <Icon
                              name="thumbs up outline"
                              color="teal"
                              size="large"
                              onClick={() =>
                                this.iconThumbsUp(post.id, "upVote")}
                            />
                            <div className="vote-score">
                              <p className="vote-score-num">{post.voteScore}</p>
                            </div>
                            <Icon
                              name="thumbs down outline"
                              color="red"
                              size="large"
                              onClick={() =>
                                this.iconThumbsDown(post.id, "downVote")}
                            />
                          </List.Content>
                          <List.Content className="comments" key={post.id}>
                            <Icon
                              name="comment outline"
                              color="teal"
                              size="large"
                            />
                            {post.comments && post.comments.length}
                          </List.Content>
                        </List.Content>
                      </List.Item>
                      <div className="post-btn-wrapper">
                        {/*Added responsive element to the buttons, so less text will be
                    displayed on mobile devices*/}
                        <Responsive
                          as={Button}
                          onClick={() => this.deletePost(post.id)}
                          compact
                          basic
                          color="red"
                          size="tiny"
                          floated="right"
                          maxWidth={400}
                        >
                          <Icon name="trash" />
                          Delete
                        </Responsive>
                        <Responsive
                          as={Button}
                          onClick={() => this.deletePost(post.id)}
                          compact
                          basic
                          color="red"
                          size="tiny"
                          floated="right"
                          minWidth={401}
                        >
                          <Icon name="trash" />
                          Delete post
                        </Responsive>

                        <Link to={`/editpost/${post.id}`}>
                          <Responsive
                            as={Button}
                            compact
                            basic
                            color="teal"
                            size="tiny"
                            floated="left"
                            maxWidth={400}
                          >
                            <Icon name="edit" />
                            Edit
                          </Responsive>
                          <Responsive
                            as={Button}
                            compact
                            basic
                            color="teal"
                            size="tiny"
                            floated="right"
                            minWidth={401}
                          >
                            <Icon name="edit" />
                            Edit post
                          </Responsive>
                        </Link>
                      </div>
                    </Segment>
                  </List>
                ))}
            <div className="btn-add">
              <Link to="/addpost">
                <Button compact color="teal" size="large">
                  <Icon name="plus circle" />
                  Add Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//Give the HomePage access to the redux store state for receivePosts and sort.
//Pass reducers directly into mapStateToProps (instead of the state), so we need less code.
const mapStateToProps = ({ posts, sort }) => ({
  posts,
  sort
});

//Imported all actions from action folder. Pass actions into connect,
//so they can be accessed via this.props and a mapDispatchToProps function isn't needed.
export default connect(mapStateToProps, actions)(HomePage);
