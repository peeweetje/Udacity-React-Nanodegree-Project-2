import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormInput from '../forms/form-input';
import FormTextarea from '../forms/form-textarea';

interface EditCommentCardProps {
  commentAuthor: string;
  commentContent: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

const EditCommentCard = ({
  commentAuthor,
  commentContent,
  containerRef,
  onInputChange,
  onSubmit,
}: EditCommentCardProps) => {
  const { t } = useTranslation();

  return (
    <div ref={containerRef}>
      <Card className='edit-comment-card w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center text-primary dark:text-white'>
            {t('editComment.edit-comment')}
          </CardTitle>
          <CardDescription className='text-center dark:text-gray-400'>
            {t('editComment.edit-description')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className='space-y-4'>
            <FormInput
              id='commentAuthor'
              name='commentAuthor'
              labelKey='editComment.label-author'
              value={commentAuthor}
              onChange={onInputChange}
            />
            <FormTextarea
              id='commentContent'
              name='commentContent'
              labelKey='editComment.label-content'
              value={commentContent}
              onChange={onInputChange}
            />
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              <Edit className='w-4 h-4 mr-2' aria-hidden='true' />
              <span> {t('editComment.button-edit')}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditCommentCard;