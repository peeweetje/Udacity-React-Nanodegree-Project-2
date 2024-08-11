import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditComment, fetchComment } from '../../redux/actions';
import Menu from '../menu/menu';
import SideBar from '../sidebar/sideBar';
import { Form, Header, Icon } from 'semantic-ui-react';

const EditComment = ({ match, history }) => {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const dispatch = useDispatch();
  const receiveComment = useSelector((state) => state.receiveComment);

  useEffect(() => {
    dispatch(fetchComment(match.params.commentId));
  }, [dispatch, match.params.commentId]);

  useEffect(() => {
    if (receiveComment) {
      const { author, body } = receiveComment;
      setCommentAuthor(author);
      setCommentContent(body);
    }
  }, [receiveComment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'commentAuthor') {
      setCommentAuthor(value);
    } else if (name === 'commentContent') {
      setCommentContent(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: receiveComment.id,
      body: commentContent,
      author: commentAuthor,
    };
    dispatch(fetchEditComment(data, data.id));
    history.goBack();
  };

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='add-post-form'>
        <Header
          className='editcomment-header'
          textAlign='center'
          color='teal'
          as='h1'
        >
          Edit Comment
        </Header>

        <Menu />

        <Form onSubmit={handleSubmit}>
          <Form.Input
            required
            name='commentAuthor'
            value={commentAuthor}
            onChange={handleInputChange}
            label='Author'
          />
          <Form.Input
            required
            name='commentContent'
            value={commentContent}
            onChange={handleInputChange}
            label='Comment Content'
            rows={6}
          />
          <Form.Button
            name='form-button-control-public'
            color='teal'
            compact
            size='large'
          >
            <Icon name='edit' />
            Edit comment
          </Form.Button>
        </Form>
      </div>
    </div>
  );
};

export default EditComment;
