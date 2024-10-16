import { editComment } from './../../utils/api';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditComment, fetchComment } from '../../redux/actions';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Comment {
  id: string;
  author: string;
  body: string;
}

interface RootState {
  receiveComment: Comment | null;
}

const EditComment: React.FC = () => {
  const { t } = useTranslation();
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');
  const dispatch = useDispatch();
  const params = useParams<{ commentId: string }>();
  const navigate = useNavigate();
  const receiveComment = useSelector(
    (state: RootState) => state.receiveComment
  );

  useEffect(() => {
    const commentId = params?.commentId;
    if (commentId) {
      dispatch(fetchComment(commentId));
    }
  }, [dispatch, params]);

  useEffect(() => {
    if (receiveComment) {
      setCommentAuthor(receiveComment.author || '');
      setCommentContent(receiveComment.body || '');
    }
  }, [receiveComment]);

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
    if (receiveComment) {
      const data: Comment = {
        id: receiveComment.id,
        body: commentContent,
        author: commentAuthor,
      };
      dispatch(fetchEditComment(data, data.id));
      navigate(-1);
    }
  };

  return (
    <div className='flex min-h-screen bg-background'>
      <main className='flex-1 p-8'>
        <Card className='w-full max-w-md mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center text-primary'>
              {t('editComment.edit-comment')}
            </CardTitle>
            <CardDescription className='text-center'>
              {t('editComment.edit-description')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='commentAuthor'>
                  {t('editComment.label-author')}
                </Label>
                <Input
                  className='border-teal-200'
                  id='commentAuthor'
                  name='commentAuthor'
                  value={commentAuthor}
                  onChange={handleInputChange}
                  required
                  aria-required='true'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='commentContent'>
                  {t('editComment.label-content')}
                </Label>
                <Textarea
                  className='border-teal-200'
                  id='commentContent'
                  name='commentContent'
                  value={commentContent}
                  onChange={handleInputChange}
                  rows={6}
                  required
                  aria-required='true'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full'>
                <Edit className='w-4 h-4 mr-2' aria-hidden='true' />
                <span> {t('editComment.button-edit')}</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default EditComment;
