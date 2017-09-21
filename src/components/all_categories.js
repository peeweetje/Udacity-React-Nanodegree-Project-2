import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPostsCategory } from "../actions";
import { Header, Segment } from "semantic-ui-react";

class AllCategories extends Component {
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
              categories: {this.props.match.params.category}
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
              </Segment>
            </div>
          ))
        ) : (
          <h3>
            There are no posts in this category. Do you want to make a new post?
          </h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllCategories);
