import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import CategoryItem from '../category-item/catergory-item';
import Menu from '../menu/menu';
import SideBar from '../sidebar/sideBar';
import { sortPosts } from '../../utils/sortPosts';
import * as actions from '../../redux/actions';
import { useTranslation } from 'react-i18next';

interface Post {
  id: string;
  deleted: boolean;
  error: boolean;
}

interface SortState {
  value: string;
}

interface RootState {
  posts: {
    posts: Post[];
  };
  sort: SortState;
}

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.posts);
  const { sort } = useSelector((state: RootState) => state.sort);
  const { category: categoryName } = useParams<{ category: string }>();

  useEffect(() => {
    if (categoryName) {
      dispatch(actions.fetchPostsCategory(categoryName));
    }
  }, [categoryName, dispatch]);

  const handleDeletePost = (postId: string) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const handleVotePost = (postId: string, option: string) => {
    dispatch(actions.fetchVotePost(postId, option));
  };

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  const filteredAndSortedPosts: Post[] =
    posts && posts.length > 0
      ? sortPosts(
          posts.filter((post) => !post.deleted && !post.error),
          sort.value
        )
      : [];

  return (
    <div className='flex min-h-screen bg-background'>
      <SideBar />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-primary mb-4'>
            {t('common.git-talks')}
          </h1>
          <div className='mt-4 mb-6 flex justify-center'>
            <Menu />
          </div>
          <div className='flex justify-center'>
            <Card className='w-auto'>
              <CardContent className='p-4 bg-teal-100'>
                <p className='text-lg font-semibold text-primary bg-teal-100'>
                  {t('common.category')} : {formattedCategoryName}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='mt-4 space-y-4'>
          {filteredAndSortedPosts.length > 0 ? (
            filteredAndSortedPosts.map((post) => (
              <CategoryItem
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                onVote={handleVotePost}
              />
            ))
          ) : (
            <div className='flex justify-center mx-40'>
              <h3 className='text-xl font-semibold text-muted-foreground text-center mt-4'>
                {t('common.no-posts')}
              </h3>
            </div>
          )}
        </div>
        <div className='mt-8 text-center'>
          <Button asChild className='w-34 text-sm'>
            <Link to='/addpost'>
              <PlusCircle className='h-5 w-5 mr-2' />
              <span className='font-semibold'>{t('common.add-post')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
