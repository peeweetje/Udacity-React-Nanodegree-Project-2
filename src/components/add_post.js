import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Header, Icon } from "semantic-ui-react";

class AddPost extends Component {
  state = {
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

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="add-post-form ">
        <Header textAlign="center" color="teal" as="h1">
          Add Post
        </Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Dropdown
            fluid
            multiple
            selection
            placeholder="Category"
            label="Choose Category"
            options={[
              { key: 1, text: "React", value: 1 },
              { key: 2, text: "Redux", value: 2 },
              { key: 3, text: "Udacity", value: 3 },
              { key: 4, text: "Javascript", value: 4 }
            ]}
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

export default connect()(AddPost);
