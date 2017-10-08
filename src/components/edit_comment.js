import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEditComment, fetchSinglePost, fetchComments } from "../actions";
import { Form, Header, Icon } from "semantic-ui-react";

class EditComment extends Component {
  state = {
    id: "",
    commentAuthor: "",
    commentContent: ""
  };

  componentDidMount() {
    //this.props.fetchPost(this.props.match.params.postId);
    //this part needs to be changed to work for comments
    console.log(this.props.match.params.id);
    const { parentId } = this.props.match.params;
    console.log(this.props.comments.parentId);
    console.log(this.props.match.params.parentId);
    this.props.fetchPost(parentId).then(() => {
      const { id, author, body } = this.props.post;
      console.log(this.props.post.title);
      this.setState({
        id: id,
        commentAuthor: author,
        commentContent: body
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

  handleSubmit = e => {
    e.preventDefault();
    const { id, commentContent, commentAuthor } = this.state;
    const data = {
      id: id,
      body: commentContent,
      author: commentAuthor
    };
    // needs to be changed to editComment when created: this.props.editPost(data, data.id);
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="add-post-form ">
        <Header textAlign="center" color="teal" as="h1">
          Edit Comment
        </Header>
        <Form>
          <Form.Input
            required
            name="commentAuthor"
            value={this.state.commenttAuthor}
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
  post: state.receivePost,
  comments: state.getComments
});

const mapDispatchToProps = dispatch => {
  return {
    editComment: (comment, postId) =>
      dispatch(fetchEditComment(comment, postId)),
    fetchPost: postId =>
      dispatch(fetchSinglePost(postId)).then(() =>
        dispatch(fetchComments(postId))
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditComment);
