import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
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
import SinglePost from './single_post';
import SingleComment from './single_comment';
import { Header, Button, Icon, Form } from 'semantic-ui-react';
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
          posts?.length > 0 &&
          posts
            .filter(
              (post) =>
                !post.deleted && Object.keys(post).length > 0 && !post.error
            )
            .map((post) => (
              <SinglePost
                key={post.id}
                post={post}
                commentsCount={comments?.length > 0 ? comments.length : 0}
                onUpvote={iconThumbsUp}
                onDownvote={iconThumbsDown}
                onDelete={deletePost}
              />
            ))}

        <div className='comments-wrapper'>
          {posts &&
            posts?.length > 0 &&
            posts.filter(
              (post) => !post.deleted && Object.keys(post).length > 0
            ).length > 0 &&
            comments &&
            comments?.length > 0 &&
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
                <SingleComment
                  key={comment.id}
                  comment={comments?.length > 0 ? comment : null}
                  onUpvote={iconThumbsUpComment}
                  onDownvote={iconThumbsDownComment}
                  onDelete={onDeleteComment}
                />
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
