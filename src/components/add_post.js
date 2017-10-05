import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Header, Icon, Label } from "semantic-ui-react";
import { fetchAddPost } from "../actions";
const uuidv1 = require("uuid/v1");

const options = [
  { key: 1, text: "React", value: "react" },
  { key: 2, text: "Redux", value: "redux" },
  { key: 3, text: "Udacity", value: "udacity" },
  { key: 4, text: "Javascript", value: "javascript" }
];

class AddPost extends Component {
  state = {
    postCategory: "react",
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
    console.log(this.state);
  };

  setPostCategory = (e, data) => {
    this.setState({ postCategory: data.value });
    console.log(this.state);
  };

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      title: this.state.postTitle,
      body: this.state.postContent,
      author: this.state.postAuthor,
      category: this.state.postCategory,
      deleted: false,
      voteScore: 1
    };
    this.props.addPost(data);
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="add-post-form ">
        <Header textAlign="center" color="teal" as="h1">
          Add Post
        </Header>

        <Label content={`Current: ${this.state.postCategory}`} />

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
            <Icon name="plus circle" />
            Add Post
          </Form.Button>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addPost: post => dispatch(fetchAddPost(post))
  };
};

export default connect(null, mapDispatchToProps)(AddPost);
