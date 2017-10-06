import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEditPost, fetchSinglePost } from "../actions";
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
    //this.props.fetchPost(this.props.match.params.postId);
    console.log(this.props.match.params.postId);

    const { postId } = this.props.match.params;
    this.props.fetchPost(postId).then(() => {
      const { id, title, author, body, category } = this.props.post;
      console.log(this.props.post.title);
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
    this.props.editPost(data, data.id);
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="add-post-form ">
        <Header textAlign="center" color="teal" as="h1">
          Edit Post
        </Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Select
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

            //label="Label with htmlFor"
          >
            <Icon name="edit" />
            Edit Post
          </Form.Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.receivePost
});

const mapDispatchToProps = dispatch => {
  return {
    editPost: (post, postId) => dispatch(fetchEditPost(post, postId)),
    fetchPost: postId => dispatch(fetchSinglePost(postId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
