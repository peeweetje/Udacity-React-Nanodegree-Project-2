import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts, fetchCategories } from "../actions";
import { Link } from "react-router-dom";

class HomePage extends Component {
  componentDidMount() {
    this.props.getData();
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <h1>Readable</h1>
          </div>

          <ul>
            {this.props.categories &&
              this.props.categories.length > 0 &&
              this.props.categories.map(category => (
                <li key={category.path}>
                  <Link to={`/${category.name}`}>{category.name}</Link>
                </li>
              ))}
          </ul>
        </div>

        {console.log(this.props.posts)}
        {this.props.posts.length > 0 &&
          this.props.posts.map(post => (
            <div className="post" key={post.id}>
              <h6 className="postTitle">{post.title}</h6>
              {console.log(post.title)}
            </div>
          ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.receivePosts,
    categories: state.receiveCategories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () =>
      dispatch(fetchPosts()).then(() => dispatch(fetchCategories()))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
