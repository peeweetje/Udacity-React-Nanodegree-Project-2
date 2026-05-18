import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchCategories } from '../../redux/actions';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';

interface Category {
  path: string;
  name: string;
}

interface RootState {
  receiveCategories: Category[];
}

const SideBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const receiveCategories = useSelector(
    (state: RootState) => state.receiveCategories
  );

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='fixed top-4 left-4 z-50' variant='outline' size='icon'>
            <MenuIcon className='h-5 w-5' />
            <span className='sr-only'>{t('common.toggle-menu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          className='w-[250px] sm:w-[300px] bg-teal-500 overflow-y-auto [&_.lucide-x]:text-white'
          side='left'
        >
          <SheetTitle className='text-2xl font-bold text-white py-4 px-4'>
            {t('common.git-talks')}
          </SheetTitle>

          {/* Categories */}
          <nav className='flex flex-col space-y-2 px-4 mt-6'>
            {receiveCategories.length > 0 &&
              receiveCategories.map((category) => (
                <Link
                  key={category.path}
                  to={`/${category.name}`}
                  className='text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200'
                >
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </Link>
              ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideBar;