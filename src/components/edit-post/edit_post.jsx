import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditPost, fetchSinglePost } from '../../redux/actions';
import SideBar from '../sidebar/sideBar';
import { Form, Header, Icon } from 'semantic-ui-react';
import { options } from '../../utils/options';

const EditPost = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [post, setPost] = useState({
    id: '',
    postCategory: '',
    postTitle: '',
    postAuthor: '',
    postContent: '',
  });

  const { postId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      dispatch(fetchSinglePost(postId)).then(() => {
        const fetchedPost = posts.find((post) => post.id === postId);
        if (fetchedPost) {
          const { id, title, author, body, category } = fetchedPost;
          setPost({
            id,
            postTitle: title,
            postAuthor: author,
            postContent: body,
            postCategory: category,
          });
        }
      });
    }
  }, [postId, fetchSinglePost]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const setPostCategory = (e, data) => {
    setPost((prevPost) => ({
      ...prevPost,
      postCategory: data.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, postTitle, postCategory, postContent, postAuthor } = post;
    const data = {
      id,
      title: postTitle,
      body: postContent,
      author: postAuthor,
      category: postCategory,
    };
    dispatch(fetchEditPost(data, data.id));
    navigate('/');
  };

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='editpost-header'>
        <Header color='teal' as='h1' textAlign='center'>
          <Icon name='edit' />
          Edit Post
        </Header>
      </div>
      <div className='add-post-form'>
        <Form onSubmit={handleSubmit}>
          <Form.Dropdown
            label='Category'
            options={options}
            value={post.postCategory}
            onChange={setPostCategory}
            selection
          />
          <Form.Input
            required
            name='postTitle'
            value={post.postTitle}
            onChange={handleInputChange}
            label='Post Title'
            placeholder='Post Title'
          />
          <Form.Input
            required
            name='postAuthor'
            value={post.postAuthor}
            onChange={handleInputChange}
            label='Author'
            placeholder='Author'
          />
          <Form.TextArea
            required
            label='Content'
            name='postContent'
            value={post.postContent}
            onChange={handleInputChange}
            placeholder='Post Content'
            rows={6}
          />

          <Form.Button
            type='submit'
            name='form-button-control-public'
            color='teal'
            compact
            size='large'
          >
            <Icon name='edit' />
            Edit Post
          </Form.Button>
        </Form>
      </div>
    </div>
  );
};

export default EditPost;
