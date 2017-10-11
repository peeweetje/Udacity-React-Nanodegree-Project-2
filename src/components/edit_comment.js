import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEditComment, fetchComment } from "../actions";
import { Form, Header, Icon } from "semantic-ui-react";

class EditComment extends Component {
  state = {
    commentAuthor: "",
    commentContent: ""
  };

  componentDidMount() {
    this.props.getComment(this.props.match.params.commentId).then(() => {
      const { author, body } = this.props.comment;
      this.setState({
        commentAuthor: author,
        commentContent: body
      });
    });
    console.log(this.props.match.params.commentId);
    console.log(this.props.comment);
  }

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
    const { commentContent, commentAuthor } = this.state;
    const data = {
      id: this.props.comment.id,
      body: commentContent,
      author: commentAuthor
    };
    console.log(data);
    this.props.editComment(data, data.id);
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="add-post-form ">
        <Header textAlign="center" color="teal" as="h1">
          Edit Comment
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            required
            name="commentAuthor"
            value={this.state.commentAuthor}
            onChange={this.handleInputChange}
            label="Author"
          />

          <Form.TextArea
            required
            name="commentContent"
            value={this.state.commentContent}
            onChange={this.handleInputChange}
            label="Comment Content"
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
            Edit comment
          </Form.Button>
        </Form>
      </div>
    );
  }
}

//needs to be changed to work for comments instead of for posts!
const mapStateToProps = state => ({
  comment: state.receiveComment
});

const mapDispatchToProps = dispatch => {
  return {
    getComment: commentId => dispatch(fetchComment(commentId)),
    editComment: (comment, commentId) =>
      dispatch(fetchEditComment(comment, commentId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditComment);
