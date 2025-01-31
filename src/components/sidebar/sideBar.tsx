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

const SideBar: React.FC = () => {
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
          <Button className='mx-4 my-4' variant='outline' size='icon'>
            <MenuIcon className='h-4 w-4' />
            <span className='sr-only'>{t('common.toggle-menu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          className='w-[175px] sm:w-[250px] bg-teal-500'
          side='left'
        >
          <SheetTitle className='py-4'>Categories</SheetTitle>
          <nav className='flex flex-col space-y-4'>
            {receiveCategories.length > 0 &&
              receiveCategories.map((category) => (
                <Link
                  key={category.path}
                  to={`/${category.name}`}
                  className='text-md font-bold text-neutral-100 hover:text-teal-700'
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
