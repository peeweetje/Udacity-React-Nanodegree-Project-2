import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEditPost, fetchSinglePost } from "../actions";
import Menu from "./menu";
import SideBar from "./sideBar";
import { Form, Header, Icon } from "semantic-ui-react";

const options = [
  { key: 1, text: "React", value: "react" },
  { key: 2, text: "Redux", value: "redux" },
  { key: 3, text: "Udacity", value: "udacity" },
  { key: 4, text: "Javascript", value: "javascript" }
];

class EditPost extends Component {
  state = {
    id: "",
    postCategory: "",
    postTitle: "",
    postAuthor: "",
    postContent: ""
  };

  componentDidMount() {
    const { postId } = this.props.match.params;
    //Fetches post matching a postId, then uses the data from the post to set the state,
    //and prepopulate the edit post form with this data.
    this.props.fetchSinglePost(postId).then(() => {
      const { id, title, author, body, category } = this.props.posts.posts[0];
      this.setState({
        id: id,
        postTitle: title,
        postAuthor: author,
        postContent: body,
        postCategory: category
      });
    });
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  setPostCategory = (e, data) => {
    this.setState({ postCategory: data.value });
    console.log(this.state);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { id, postTitle, postCategory, postContent, postAuthor } = this.state;
    const data = {
      id: id,
      title: postTitle,
      body: postContent,
      author: postAuthor,
      category: postCategory
    };
    this.props.fetchEditPost(data, data.id);
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="page-wrapper">
        <SideBar />

        <div className="editpost-header">
          <Header textAlign="center" color="teal" as="h1">
            Edit Post
          </Header>
        </div>

        <div className="edit-post-menu">
          <Menu />
        </div>
        <div className="add-post-form">
          <Form onSubmit={this.handleSubmit}>
            <Form.Select
              required
              name="postCategory"
              placeholder="Category"
              label="Choose Category"
              value={this.state.postCategory}
              onChange={this.setPostCategory}
              options={options}
            />

            <Form.Input
              required
              name="postTitle"
              id="post-title"
              value={this.state.postTitle}
              onChange={this.handleInputChange}
              label="Post Title"
              placeholder="Post Title"
            />
            <Form.Input
              required
              name="postAuthor"
              value={this.state.postAuthor}
              onChange={this.handleInputChange}
              label="Author"
              placeholder="Author"
            />

            <Form.TextArea
              required
              name="postContent"
              value={this.state.postContent}
              onChange={this.handleInputChange}
              label="Post Content"
              placeholder="Post Content"
              rows={6}
            />
            <Form.Button
              name="form-button-control-public"
              color="teal"
              compact
              size="large"
            >
              <Icon name="edit" />
              Edit Post
            </Form.Button>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

export default connect(mapStateToProps, { fetchEditPost, fetchSinglePost })(
  EditPost
);
