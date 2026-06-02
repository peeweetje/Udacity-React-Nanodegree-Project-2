import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment,
  fetchDeleteComment,
  fetchVoteComment,
  fetchVotePost,
} from '../../redux/actions';
import { v1 as uuidv1 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import Menu from '../menu/menu';
import MobileSidebar from '../dashboard-page/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import BackButton from '@/components/ui/back-button';
import SinglePost from './single-post';
import SingleComment from './single-comment';
import { Post } from '../../types/post';
import { animateCards } from '../animations/card-animations';

interface Comment {
  id: string;
  timestamp: number;
  body: string;
  author: string;
  parentId: string;
  deleted: boolean;
  parentDeleted: boolean;
  voteScore: number;
}

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

const PostDetail= () => {
  const { t } = useTranslation();
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post_id } = useParams<{ post_id: string }>();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const comments = useSelector(
    (state: RootState) => state.getComments.comments
  );
  const sort = useSelector((state: RootState) => state.sort.sort);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const contentContainerRef = useRef<HTMLDivElement>(null);

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

  // Animate the add-comment card on mount (stable dep — only re-triggers when
  // comments array length changes, i.e. when a comment is added or removed).
  useEffect(() => {
    const ctx = gsap.context(() => {
      animateCards('.add-comment-card', animationsEnabled, 0.15, 0.5);
    }, contentContainerRef);

    return () => ctx.revert();
  }, [animationsEnabled, comments?.length]);
  // SingleComment now handles its own card entrance and hover animations internally.
  // No need to animate .comment-card from here to avoid re-animation on vote.

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

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className='flex-1 p-8'>
        <div className='flex flex-col items-center mb-8'>
          <h1 className='text-3xl font-bold text-center text-primary dark:text-white mb-4'>
            {t('common.git-talks')}
          </h1>
          <BackButton />
        </div>
        <Menu />
        <div ref={contentContainerRef} className='w-4/5 mx-auto'>
          {filteredPosts?.map((post) => (
            <SinglePost
              key={post.id}
              post={post}
              commentsCount={comments?.length || 0}
              onUpvote={iconThumbsUp}
              onDownvote={iconThumbsDown}
              onDelete={deletePost}
            />
          ))}

          <div className='mt-8'>
            {sortedComments?.map((comment) => (
              <SingleComment
                key={comment.id}
                comment={comment}
                onUpvote={iconThumbsUpComment}
                onDownvote={iconThumbsDownComment}
                onDelete={onDeleteComment}
              />
            ))}

            {filteredPosts?.length > 0 ? (
              <Card className='add-comment-card mt-8 dark:bg-gray-800 dark:border-gray-700'>
                <CardHeader>
                  <CardTitle className='dark:text-white'>{t('postDetails.add-comment')}</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <label
                        htmlFor='commentAuthor'
                        className='text-sm font-medium dark:text-white'
                      >
                        {t('postDetails.label-author')}
                      </label>
                      <Input
                        className='border-teal-200'
                        id='commentAuthor'
                        name='commentAuthor'
                        value={commentAuthor}
                        onChange={handleInputChange}
                        placeholder={t('postDetails.label-author')}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <label
                        htmlFor='commentContent'
                        className='text-sm font-medium dark:text-white'
                      >
                        {t('postDetails.comment-content')}
                      </label>
                      <Textarea
                        className='border-teal-200'
                        id='commentContent'
                        name='commentContent'
                        value={commentContent}
                        onChange={handleInputChange}
                        placeholder={t('postDetails.add-comment')}
                        rows={6}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-34' type='submit' size='sm'>
                      <PlusCircle className='mr-2 w-4 h-4' />
                      {t('postDetails.add-comment-button')}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card className='mt-8 dark:bg-gray-800 dark:border-gray-700'>
                <CardContent className='text-center py-8'>
                  <h3 className='text-xl font-semibold dark:text-white mb-4'>
                    Post not found.
                  </h3>
                  <Button onClick={() => navigate(-1)} size='sm'>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
