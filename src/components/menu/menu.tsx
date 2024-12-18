import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchPostsCategory } from '../../redux/actions';
import SortBy from '../sort-by/sortBy';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Category {
  path: string;
  name: string;
}

interface RootState {
  receiveCategories: Category[];
}

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const receiveCategories = useSelector(
    (state: RootState) => state.receiveCategories
  );

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    dispatch(fetchPostsCategory(category) as any);
    navigate(`/${category}`);
  };

  return (
    <div className='flex justify-center my-6'>
      <div className='hidden md:grid grid-cols-6 gap-6'>
        <div>
          <Button size='sm' className='w-full' onClick={() => navigate('/')}>
            {t('common.all')}
          </Button>
        </div>
        {receiveCategories.length > 0 &&
          receiveCategories.map((category) => (
            <div key={category.path}>
              <Button
                size='sm'
                className='w-full'
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            </div>
          ))}
        <div>
          <SortBy />
        </div>
      </div>
      <div className='md:hidden'>
        <SortBy />
      </div>
    </div>
  );
};

export default Menu;
