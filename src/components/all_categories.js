import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Timestamp from "react-timestamp";
import { fetchPostsCategory } from "../actions";
import { Header, Segment, List, Icon, Button, Grid } from "semantic-ui-react";

class Categories extends Component {
  componentDidMount() {
    this.props.fetchData(this.props.match.params.category);
  }

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
                <List.Content>Vote: {post.voteScore}</List.Content>
              </Segment>

              <Segment color="teal" raised>
                <h3>hello comments</h3>
              </Segment>
            </div>
          ))
        ) : (
          <Segment color="teal" raised>
            <h3>
              There are no posts in this category. Do you want to make a new
              post?
            </h3>
            <Button compact basic color="teal" size="tiny" floated="right">
              add post
            </Button>
          </Segment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.getPostsCategory
});

const mapDispatchToProps = dispatch => ({
  fetchData: category => dispatch(fetchPostsCategory(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
