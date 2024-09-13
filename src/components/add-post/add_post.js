import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Header, Icon } from 'semantic-ui-react';
import { fetchAddPost } from '../../redux/actions';
import SideBar from '../sidebar/sideBar';
import { v1 as uuidv1 } from 'uuid';

import './add-post.scss';

const options = [
  { key: 1, text: 'React', value: 'react' },
  { key: 2, text: 'Redux', value: 'redux' },
  { key: 3, text: 'Udacity', value: 'udacity' },
  { key: 4, text: 'Javascript', value: 'javascript' },
];

const AddPost = () => {
  const [postCategory, setPostCategory] = useState('react');
  const [postTitle, setPostTitle] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postContent, setPostContent] = useState('');
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'postTitle') setPostTitle(value);
    if (name === 'postAuthor') setPostAuthor(value);
    if (name === 'postContent') setPostContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      title: postTitle,
      body: postContent,
      author: postAuthor,
      category: postCategory,
      deleted: false,
      voteScore: 1,
    };
    dispatch(fetchAddPost(data));
    navigate('/');
  };

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='add-post-form'>
        <Header
          className='add-post-header'
          textAlign='center'
          color='teal'
          as='h1'
        >
          <Icon name='edit' /> Add New Post
        </Header>
        <Form className='addpost-form' onSubmit={handleSubmit}>
          <Form.Dropdown
            label='Category'
            options={options}
            value={postCategory}
            onChange={(e, data) => setPostCategory(data.value)}
            selection
          />
          <Form.Input
            required
            label='Title'
            name='postTitle'
            value={postTitle}
            onChange={handleInputChange}
            label='Post Title'
            placeholder='Post Title'
          />
          <Form.Input
            required
            label='Author'
            name='postAuthor'
            value={postAuthor}
            onChange={handleInputChange}
            label='Author'
            placeholder='Author'
          />
          <Form.TextArea
            required
            label='Content'
            name='postContent'
            value={postContent}
            onChange={handleInputChange}
            placeholder='Post Content'
            rows={6}
          />

          <Form.Button
            name='form-button-control-public'
            color='teal'
            compact
            size='large'
          >
            <Icon name='plus circle' />
            Add Post
          </Form.Button>
        </Form>
      </div>
    </div>
  );
};

export default AddPost;
