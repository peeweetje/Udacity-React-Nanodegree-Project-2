import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import gsap from 'gsap';
import * as actions from '../../redux/actions';
import { sortPosts } from '../../utils/sortPosts';
import { animateVoteButton } from '../animations/vote-animations';
import { animateCards, animateCardHover } from '../animations/card-animations';
import Loading from '../loading/loading';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trash2,
  Edit,
  PlusCircle,
  User,
  Clock,
  Home,
  LayoutDashboard,
} from 'lucide-react';

import Menu from '../menu/menu';
import MobileSidebar from '../dashboard-page/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import BackButton from '@/components/ui/back-button';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types/post';

interface RootState {
  posts: {
    posts: Post[];
  };
  sort: {
    sort: {
      value: string;
    };
  };
}

const PostsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const sort = useSelector((state: RootState) => state.sort.sort);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.fetchPosts());
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    };
    fetchData();
  }, [dispatch]);

  const deletePost = (postId: string) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const iconThumbsUp = (postId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(actions.fetchVotePost(postId, 'upVote'));
    animateVoteButton(e.currentTarget, 'up', animationsEnabled);
  };

  const iconThumbsDown = (postId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(actions.fetchVotePost(postId, 'downVote'));
    animateVoteButton(e.currentTarget, 'down', animationsEnabled);
  };

  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      animateCards('.post-card', animationsEnabled, 0.2, 0.4);
    }, postsContainerRef);

    return () => ctx.revert();
  }, [animationsEnabled, posts.length, loading]);
  // Note: Only depends on posts.length (triggers when posts are added/removed), not the full posts array.
  // This prevents re-animation on vote because voteScore changes don't affect array length.

  useEffect(() => {
    if (loading || !animationsEnabled) return;
    const cards = postsContainerRef.current?.querySelectorAll('.post-card');
    if (!cards) return;
    const hoverCleanups = Array.from(cards).map(card => animateCardHover(card));
    return () => {
      hoverCleanups.forEach(cleanup => cleanup());
    };
  }, [animationsEnabled, loading]);
  // Note: Only depends on animationsEnabled and loading, not posts, so voting doesn't re-attach hover listeners.

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900 overflow-x-hidden'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} showNav={false} />
      <div className='flex-1 p-4 md:p-8 min-w-0'>
        <div className='container mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-primary dark:text-white'>Git Talks</h1>
            <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
              <BackButton />
              <Button asChild variant='outline' size='sm'>
                <Link to='/'>
                  <Home className='h-4 w-4 mr-2' />
                  {t('common.home', 'Home')}
                </Link>
              </Button>
              <Button asChild variant='outline' size='sm'>
                <Link to='/home'>
                  <LayoutDashboard className='h-4 w-4 mr-2' />
                  {t('common.dashboard')}
                </Link>
              </Button>
            </div>
          </div>
          <Menu />
        </div>

        <div ref={postsContainerRef} className='grid gap-6 mt-8 w-full md:w-4/5 mx-auto'>
          {posts &&
            posts.length > 0 &&
            sortPosts(
              posts.filter((post) => !post.deleted),
              sort.value
            ).map((post) => (
              <Card className='post-card w-full dark:bg-gray-800 dark:border-gray-700' key={post.id}>
                <CardHeader>
                  <CardTitle>
                    <Link
                      to={`/${post.category}/${post.id}`}
                      className='hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200 dark:text-white'
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className='dark:text-gray-400'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex items-center space-x-2'>
                        <User className='h-4 w-4' />
                        <span>{post.author}</span>
                      </div>
                      <div className='flex items-center space-x-2 mt-1'>
                        <Clock className='h-4 w-4' />
                        <Timestamp
                          date={post.timestamp / 1000}
                          options={{ twentyFourHour: true }}
                        />
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col space-y-4'>
                    <div className='flex items-center space-x-4'>
                      <Button
                        className='w-18'
                        size='sm'
                        onClick={(e) => iconThumbsUp(post.id, e)}
                      >
                        <ThumbsUp className='h-4 w-4' />
                      </Button>
                      <span className='font-bold dark:text-white'>{post.voteScore}</span>
                      <Button
                        className='w-18'
                        variant='destructive'
                        size='sm'
                        onClick={(e) => iconThumbsDown(post.id, e)}
                      >
                        <ThumbsDown className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='flex items-center dark:text-neutral-300'>
                      <MessageSquare className='h-4 w-4 mr-2' />
                      <span>{post.comments && post.comments.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end space-x-2'>
                  <Button asChild size='sm' className='w-25'>
                    <Link to={`/editpost/${post.id}`}>
                      <Edit className='h-4 w-4 mr-2' />
                      <span>{t('common.edit-post')}</span>
                    </Link>
                  </Button>
                  <Button
                    className='w-25'
                    variant='destructive'
                    size='sm'
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className='h-4 w-4 mr-2 ' />
                    <span>{t('common.delete-post')}</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        <div className='mt-8 text-center'>
          <Button asChild className='w-30'>
            <Link to='/addpost'>
              <PlusCircle className='h-4 w-4 mr-2' />
              {t('common.add-post')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;