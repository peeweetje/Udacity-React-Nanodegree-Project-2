import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment,
  fetchDeleteComment,
  fetchVoteComment,
  fetchVotePost,
} from '../../redux/actions';
import Menu from '../menu/menu';
import SideBar from '../sidebar/sideBar';

import {
  Header,
  Segment,
  Button,
  Icon,
  List,
  Form,
  Responsive,
} from 'semantic-ui-react';
import { v1 as uuidv1 } from 'uuid';

const PostDetail = () => {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();
  const { post_id } = useParams();

  const posts = useSelector((state) => state.posts.posts);
  const comments = useSelector((state) => state.getComments.comments);
  const sort = useSelector((state) => state.sort.sort);

  useEffect(() => {
    dispatch(fetchSinglePost(post_id)).then(() =>
      dispatch(fetchComments(post_id))
    );
  }, [dispatch, post_id]);

  const deletePost = useCallback(
    (postId) => {
      dispatch(fetchDeletePost(postId));
    },
    [dispatch]
  );

  const onDeleteComment = useCallback(
    (commentId) => {
      dispatch(fetchDeleteComment(commentId));
    },
    [dispatch]
  );

  const iconThumbsUp = useCallback(
    (postId) => {
      dispatch(fetchVotePost(postId, 'upVote'));
    },
    [dispatch]
  );

  const iconThumbsDown = useCallback(
    (postId) => {
      dispatch(fetchVotePost(postId, 'downVote'));
    },
    [dispatch]
  );

  const iconThumbsUpComment = useCallback(
    (commentId) => {
      dispatch(fetchVoteComment(commentId, 'upVote'));
    },
    [dispatch]
  );

  const iconThumbsDownComment = useCallback(
    (commentId) => {
      dispatch(fetchVoteComment(commentId, 'downVote'));
    },
    [dispatch]
  );

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
      id: uuidv1(),
      timestamp: Date.now(),
      body: commentContent,
      author: commentAuthor,
      parentId: post_id,
      deleted: false,
      parentDeleted: false,
      voteScore: 1,
    };
    dispatch(fetchAddComment(data));
    setCommentAuthor('');
    setCommentContent('');
  };

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='postdetail-page-container'>
        <Header textAlign='center' color='teal' as='h1'>
          Git Talks
        </Header>

        <Menu />

        {posts &&
          posts.length > 0 &&
          posts
            .filter(
              (post) =>
                !post.deleted && Object.keys(post).length > 0 && !post.error
            )
            .map((post) => (
              <div key={post.id} className='post-wrapper'>
                <Segment color='teal' raised>
                  <h3 className='title'>{post.title}</h3>
                  <List.Content className='author'>
                    <Icon name='user' color='teal' size='large' />
                    {post.author}
                  </List.Content>
                  <List.Content className='time'>
                    <Icon color='teal' name='clock' size='large' />
                    <Timestamp time={post.timestamp / 1000} format='full' />
                  </List.Content>
                  <List.Content className='post-body'>{post.body}</List.Content>
                  <List.Content className='votes'>
                    <Icon
                      name='thumbs up outline'
                      color='teal'
                      size='large'
                      onClick={() => iconThumbsUp(post.id)}
                    />
                    <div className='vote-score'>
                      <p className='vote-score-num'>{post.voteScore}</p>
                    </div>
                    <Icon
                      name='thumbs down outline'
                      color='red'
                      size='large'
                      onClick={() => iconThumbsDown(post.id)}
                    />
                  </List.Content>
                  <List.Content className='comments'>
                    <Icon name='comment outline' color='teal' size='large' />
                    {comments && comments.length}
                  </List.Content>
                  <div className='post-btn-wrapper'>
                    <Responsive
                      as={Button}
                      onClick={() => deletePost(post.id)}
                      compact
                      basic
                      color='red'
                      size='tiny'
                      floated='right'
                      maxWidth={680}
                      className='postdetail-deletepost-btn'
                    >
                      <Icon name='trash' />
                      Delete
                    </Responsive>
                    <Responsive
                      as={Button}
                      onClick={() => deletePost(post.id)}
                      compact
                      basic
                      color='red'
                      size='tiny'
                      floated='right'
                      minWidth={681}
                    >
                      <Icon name='trash' />
                      Delete post
                    </Responsive>

                    <Link to={`/editpost/${post.id}`}>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='teal'
                        size='tiny'
                        floated='left'
                        maxWidth={680}
                        className='postdetail-editpost-btn'
                      >
                        <Icon name='edit' />
                        Edit
                      </Responsive>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='teal'
                        size='tiny'
                        floated='right'
                        minWidth={681}
                      >
                        <Icon name='edit' />
                        Edit post
                      </Responsive>
                    </Link>
                  </div>
                </Segment>
              </div>
            ))}

        <div className='comments-wrapper'>
          {posts &&
            posts.length > 0 &&
            posts.filter(
              (post) => !post.deleted && Object.keys(post).length > 0
            ).length > 0 &&
            comments &&
            comments
              .filter((comment) => !comment.deleted)
              .filter((comment) => !comment.parentDeleted)
              .sort((a, b) => {
                switch (sort.value) {
                  case 'unpopular':
                    return a.voteScore - b.voteScore;
                  case 'oldest':
                    return a.timestamp - b.timestamp;
                  case 'newest':
                    return b.timestamp - a.timestamp;
                  default:
                    return b.voteScore - a.voteScore;
                }
              })
              .map((comment) => (
                <div key={comment.id} className='comment-wrapper'>
                  <Segment color='teal' raised className='comments-segment'>
                    <List.Content className='author'>
                      <Icon name='user' color='teal' size='large' />
                      {comment.author}
                    </List.Content>
                    <List.Content className='time'>
                      <Icon color='teal' name='clock' size='large' />
                      <Timestamp
                        format='full'
                        time={comment.timestamp / 1000}
                      />
                    </List.Content>
                    <List.Content className='comment-body'>
                      {comment.body}
                    </List.Content>
                    <List.Content className='votes'>
                      <Icon
                        name='thumbs up outline'
                        color='teal'
                        size='large'
                        onClick={() => iconThumbsUpComment(comment.id)}
                      />
                      <div className='vote-score'>
                        <p className='vote-score-num'>{comment.voteScore}</p>
                      </div>

                      <Icon
                        name='thumbs down outline'
                        color='red'
                        size='large'
                        onClick={() => iconThumbsDownComment(comment.id)}
                      />
                    </List.Content>
                    <div className='comment-btn-wrapper'>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='red'
                        size='tiny'
                        floated='right'
                        onClick={() => onDeleteComment(comment.id)}
                        maxWidth={680}
                        className='postdetail-deletecomment-btn'
                      >
                        <Icon name='trash' />
                        Delete
                      </Responsive>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='red'
                        size='tiny'
                        floated='right'
                        onClick={() => onDeleteComment(comment.id)}
                        minWidth={681}
                      >
                        <Icon name='trash' />
                        Delete comment
                      </Responsive>

                      <Link to={`/editcomment/${comment.id}`}>
                        <Responsive
                          as={Button}
                          compact
                          basic
                          color='teal'
                          size='tiny'
                          floated='left'
                          maxWidth={680}
                        >
                          <Icon name='edit' />
                          Edit
                        </Responsive>
                        <Responsive
                          as={Button}
                          compact
                          basic
                          color='teal'
                          size='tiny'
                          floated='right'
                          minWidth={681}
                        >
                          <Icon name='edit' />
                          Edit comment
                        </Responsive>
                      </Link>
                    </div>
                  </Segment>
                </div>
              ))}

          {posts &&
          posts.length > 0 &&
          posts.filter(
            (post) =>
              !post.deleted && Object.keys(post).length > 0 && !post.error
          ).length > 0 ? (
            <div className='comments-form-wrapper'>
              <Form className='add-comments-form' onSubmit={handleSubmit}>
                <h2>Add a Comment</h2>
                <Form.Input
                  required
                  name='commentAuthor'
                  value={commentAuthor}
                  onChange={handleInputChange}
                  label='Author'
                  placeholder='Author'
                />

                <Form.TextArea
                  required
                  name='commentContent'
                  value={commentContent}
                  onChange={handleInputChange}
                  label='Comment Content'
                  placeholder='Add a comment'
                  rows={6}
                />
                <Form.Button
                  className='add-comment-btn'
                  name='form-button-control-public'
                  color='teal'
                  compact
                  size='large'
                >
                  <Icon name='plus circle' />
                  Add Comment
                </Form.Button>
              </Form>
            </div>
          ) : (
            <div className='post-not-found-wrapper'>
              <h3 className='post-not-found'>Post not found.</h3>
              <Button
                className='back-btn'
                color='teal'
                compact
                size='large'
                onClick={() => history.goBack()}
              >
                <Icon name='arrow left' />
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PostDetail;
