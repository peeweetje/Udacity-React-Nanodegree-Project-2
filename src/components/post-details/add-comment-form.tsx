import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { animateCards } from '../animations/card-animations';

interface AddCommentFormProps {
  commentAuthor: string;
  commentContent: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  animationsEnabled: boolean;
  commentsCount: number;
}

const AddCommentForm = ({
  commentAuthor,
  commentContent,
  onInputChange,
  onSubmit,
  animationsEnabled,
  commentsCount,
}: AddCommentFormProps) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateCards('.add-comment-card', animationsEnabled, 0.15, 0.5);
    }, cardRef);

    return () => ctx.revert();
  }, [animationsEnabled, commentsCount]);

  return (
    <div ref={cardRef}>
      <Card className='add-comment-card mt-8 bg-card dark:bg-gray-800 border-t-4 border-teal-500 dark:border-t-4 dark:border-teal-500'>
        <CardHeader>
          <CardTitle className='text-gray-900 dark:text-white'>{t('postDetails.add-comment')}</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label
                htmlFor='commentAuthor'
                className='text-sm font-medium text-gray-900 dark:text-white'
              >
                {t('postDetails.label-author')}
              </label>
              <Input
                className='border-slate-300'
                id='commentAuthor'
                name='commentAuthor'
                value={commentAuthor}
                onChange={onInputChange}
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
                className='border-slate-300'
                id='commentContent'
                name='commentContent'
                value={commentContent}
                onChange={onInputChange}
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
    </div>
  );
};

export default AddCommentForm;