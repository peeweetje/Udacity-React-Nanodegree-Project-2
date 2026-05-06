import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  PlusCircle,
  List,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen bg-background items-center justify-center'>
      <div className='container mx-auto px-4 text-center'>
        <div className='mb-8'>
          <h1 className='text-5xl font-bold text-primary mb-4'>Git Talks</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            {t('common.welcome-message', 'A place to discuss your favorite topics. Browse posts, share your thoughts, and connect with the community.')}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-8'>
          <Button asChild size='lg' className='w-56 text-base'>
            <Link to='/posts'>
              <List className='h-5 w-5 mr-2' />
              {t('common.view-posts', 'View All Posts')}
              <ArrowRight className='h-5 w-5 ml-2' />
            </Link>
          </Button>

          <Button asChild variant='outline' size='lg' className='w-56 text-base'>
            <Link to='/addpost'>
              <PlusCircle className='h-5 w-5 mr-2' />
              {t('common.create-post', 'Create a Post')}
            </Link>
          </Button>
        </div>

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='bg-card rounded-lg p-6 shadow-sm border'>
            <MessageSquare className='h-10 w-10 text-primary mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>{t('common.discuss', 'Discuss')}</h3>
            <p className='text-muted-foreground text-sm'>
              {t('common.discuss-desc', 'Engage in conversations about various topics that interest you.')}
            </p>
          </div>
          <div className='bg-card rounded-lg p-6 shadow-sm border'>
            <List className='h-10 w-10 text-primary mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>{t('common.browse', 'Browse')}</h3>
            <p className='text-muted-foreground text-sm'>
              {t('common.browse-desc', 'Explore posts by category and discover new discussions.')}
            </p>
          </div>
          <div className='bg-card rounded-lg p-6 shadow-sm border'>
            <PlusCircle className='h-10 w-10 text-primary mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>{t('common.share', 'Share')}</h3>
            <p className='text-muted-foreground text-sm'>
              {t('common.share-desc', 'Create your own posts and share your thoughts with the community.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;