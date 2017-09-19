import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPostsCategory } from "../actions";

class AllCategories extends Component {
  componentDidMount() {
    this.props.fetchData(this.props.match.params.category);
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <h1>categories {this.props.match.params.category}</h1>
          </div>
        </div>

        {this.props.posts && this.props.posts.length > 0 ? (
          this.props.posts.map(post => (
            <div className="post" key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <h3> no posts available at this time.</h3>
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
