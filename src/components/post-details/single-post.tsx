import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Trash2,
  Edit,
  User,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  body: string;
  voteScore: number;
}

interface SinglePostProps {
  post: Post;
  commentsCount: number;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
}

const SinglePost: React.FC<SinglePostProps> = ({
  post,
  commentsCount,
  onUpvote,
  onDownvote,
  onDelete,
}) => {
  const { id, title, author, timestamp, body, voteScore } = post;

  return (
    <div className='flex flex-col mx-auto w-full  px-4'>
      <Card className='flex flex-col w-full mx-auto overflow-hidden'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-xl sm:text-2xl break-words'>
            {title}
          </CardTitle>
          <div className='flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground'>
            <User className='w-5 h-5 mr-1' />
            <span className='mr-2 break-words'>{author}</span>
            <Timestamp
              date={timestamp ? timestamp / 1000 : undefined}
              options={{ twentyFourHour: true }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm sm:text-base break-words'>{body}</p>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center space-x-2 flex-wrap'>
            <Button
              className='w-12 sm:w-18'
              size='sm'
              onClick={() => onUpvote(id)}
            >
              <ThumbsUp className='w-4 h-4' />
            </Button>
            <span className='font-bold text-sm sm:text-base'>{voteScore}</span>
            <Button
              className='w-12 sm:w-18'
              variant='destructive'
              size='sm'
              onClick={() => onDownvote(id)}
            >
              <ThumbsDown className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='ml-2'>
              <MessageCircle className='w-4 h-4 mr-1' />
              <span className='text-sm sm:text-base'>{commentsCount}</span>
            </Button>
          </div>
          <div className='flex space-x-2 w-full sm:w-auto'>
            <Button className='w-34' size='sm' asChild>
              <Link
                to={`/editpost/${id}`}
                className='flex items-center justify-center'
              >
                <Edit className='w-4 h-4 mr-1' />
                <span className='hidden sm:inline'>Edit post</span>
                <span className='sm:hidden'>Edit</span>
              </Link>
            </Button>
            <Button
              className='w-34'
              variant='destructive'
              size='sm'
              onClick={() => onDelete(id)}
            >
              <Trash2 className='w-4 h-4 mr-1' />
              <span className='hidden sm:inline'>Delete post</span>
              <span className='sm:hidden'>Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SinglePost;
