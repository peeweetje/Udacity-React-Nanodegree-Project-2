import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEditPost } from "../actions";
import { Form, Header, Icon } from "semantic-ui-react";

const options = [
  { key: 1, text: "React", value: "react" },
  { key: 2, text: "Redux", value: "redux" },
  { key: 3, text: "Udacity", value: "udacity" },
  { key: 4, text: "Javascript", value: "javascript" }
];

class EditPost extends Component {
  state = {
    postCategory: "",
    postTitle: "",
    postAuthor: "",
    postContent: ""
  };

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
            label="Post Title"
            placeholder="Post Title"
          />
          <Form.Input
            required
            name="postAuthor"
            label="Author"
            placeholder="Author"
          />

          <Form.TextArea
            required
            name="postContent"
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

const mapDispatchToProps = dispatch => {
  return {
    editPost: post => dispatch(fetchEditPost(post))
  };
};

export default connect(null, mapDispatchToProps)(EditPost);
