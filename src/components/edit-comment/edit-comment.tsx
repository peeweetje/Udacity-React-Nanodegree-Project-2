import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditComment, fetchComment } from '../../redux/actions';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';
import EditCommentCard from './edit-comment-card';

interface Comment {
  id: string;
  author: string;
  body: string;
}

interface RootState {
  receiveComment: Comment | null;
}

const EditComment = () => {
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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        <EditCommentCard
          commentAuthor={commentAuthor}
          commentContent={commentContent}
          containerRef={containerRef as React.RefObject<HTMLDivElement | null>}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default EditComment;