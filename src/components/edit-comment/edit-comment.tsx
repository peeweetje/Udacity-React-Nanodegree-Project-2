import React, { useState, useEffect, useRef } from 'react';
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
import BackButton from '@/components/ui/back-button';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';

interface Comment {
  id: string;
  author: string;
  body: string;
}

interface RootState {
  receiveComment: Comment | null;
}

const EditComment = () => {
  const { t } = useTranslation();
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');
  const dispatch = useDispatch();
  const params = useParams<{ commentId: string }>();
  const navigate = useNavigate();
  const receiveComment = useSelector(
    (state: RootState) => state.receiveComment
  );
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commentId = params?.commentId;
    if (commentId) {
      (fetchComment(commentId))(dispatch);
    }
  }, [dispatch, params]);

  useEffect(() => {
    if (receiveComment) {
      setCommentAuthor(receiveComment.author || '');
      setCommentContent(receiveComment.body || '');
    }
  }, [receiveComment]);

  useGsapContext(containerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.edit-comment-card', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled]);

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
      (fetchEditComment(data, data.id))(dispatch);
      navigate(-1);
    }
  };

  return (
    <div className='flex min-h-screen bg-background dark:bg-gray-900'>
      <main className='flex-1 p-8'>
        <div className='mb-4 text-center'>
          <BackButton />
        </div>
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
            <form onSubmit={handleSubmit}>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label  htmlFor='commentAuthor'>
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
        </div>
      </main>
    </div>
  );
};

export default EditComment;