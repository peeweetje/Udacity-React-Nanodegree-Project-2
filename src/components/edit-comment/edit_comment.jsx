import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditComment, fetchComment } from '../../redux/actions';
import SideBar from '../sidebar/sideBar';
import { Form, Header, Icon } from 'semantic-ui-react';
import { useParams,useNavigate  } from 'react-router-dom';

const EditComment = () => {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const receiveComment = useSelector((state) => state.receiveComment);

  useEffect(() => {
    const commentId = params?.commentId;
    if (commentId) {
      dispatch(fetchComment(commentId));
    }
  }, [dispatch, params]);

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
   navigate(-1);
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
           <Icon name='edit' />
          Edit Comment
        </Header>
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
