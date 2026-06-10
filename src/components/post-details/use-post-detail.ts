import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment,
  fetchDeleteComment,
  fetchVoteComment,
  fetchVotePost,
} from '../../redux/actions';
import { Post } from '../../types/post';
import { Comment } from './types';

interface RootState {
  posts: {
    posts: Post[];
  };
  getComments: {
    comments: Comment[];
  };
  sort: {
    sort: {
      value: string;
    };
  };
}

export function usePostDetail() {
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');

  const dispatch = useDispatch();
  const { post_id } = useParams<{ post_id: string }>();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const comments = useSelector(
    (state: RootState) => state.getComments.comments
  );
  const sort = useSelector((state: RootState) => state.sort.sort);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  useEffect(() => {
    if (post_id) {
      dispatch(fetchSinglePost(post_id) as any).then(() =>
        dispatch(fetchComments(post_id) as any)
      );
    }
  }, [dispatch, post_id]);

  const deletePost = useCallback(
    (postId: string) => {
      dispatch(fetchDeletePost(postId) as any);
    },
    [dispatch]
  );

  const onDeleteComment = useCallback(
    (commentId: string) => {
      dispatch(fetchDeleteComment(commentId) as any);
    },
    [dispatch]
  );

  const iconThumbsUp = useCallback(
    (postId: string) => {
      dispatch(fetchVotePost(postId, 'upVote') as any);
    },
    [dispatch]
  );

  const iconThumbsDown = useCallback(
    (postId: string) => {
      dispatch(fetchVotePost(postId, 'downVote') as any);
    },
    [dispatch]
  );

  const iconThumbsUpComment = useCallback(
    (commentId: string) => {
      dispatch(fetchVoteComment(commentId, 'upVote') as any);
    },
    [dispatch]
  );

  const iconThumbsDownComment = useCallback(
    (commentId: string) => {
      dispatch(fetchVoteComment(commentId, 'downVote') as any);
    },
    [dispatch]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'commentAuthor') {
      setCommentAuthor(value);
    } else if (name === 'commentContent') {
      setCommentContent(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Comment = {
      id: uuidv1(),
      timestamp: Date.now(),
      body: commentContent,
      author: commentAuthor,
      parentId: post_id || '',
      deleted: false,
      parentDeleted: false,
      voteScore: 1,
    };
    dispatch(fetchAddComment(data) as any);
    setCommentAuthor('');
    setCommentContent('');
  };

  const filteredPosts = posts?.filter(
    (post) => !post.deleted && Object.keys(post).length > 0 && !post.error
  );

  const sortedComments = comments
    ?.filter((comment) => !comment.deleted && !comment.parentDeleted)
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
    });

  return {
    commentAuthor,
    commentContent,
    comments,
    filteredPosts,
    sortedComments,
    animationsEnabled,
    post_id,
    handleInputChange,
    handleSubmit,
    deletePost,
    onDeleteComment,
    iconThumbsUp,
    iconThumbsDown,
    iconThumbsUpComment,
    iconThumbsDownComment,
  };
}