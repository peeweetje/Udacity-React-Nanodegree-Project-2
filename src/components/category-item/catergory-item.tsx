import React from 'react';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  MessageSquare,
  Trash,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  body: string;
  voteScore: number;
  category: string;
  comments?: Array<any>; //need to be more specific type for comments
}

interface CategoryItemProps {
  post: Post;
  onDelete: (id: string) => void;
  onVote: (id: string, option: 'upVote' | 'downVote') => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  post,
  onDelete,
  onVote,
}) => {
  const handleDelete = () => onDelete(post.id);
  const handleUpVote = () => onVote(post.id, 'upVote');
  const handleDownVote = () => onVote(post.id, 'downVote');

  return (
    <Card className='w-4/5 mx-auto mb-4'>
      <CardHeader>
        <CardTitle>
          <Link
            to={`/${post.category}/${post.id}`}
            className='hover:text-teal-500'
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <User className='h-4 w-4' />
              <span>{post.author}</span>
            </div>
            <div className='flex items-center space-x-2 mt-1'>
              <Clock className='h-4 w-4' />
              <Timestamp
                date={post.timestamp / 1000}
                options={{ twentyFourHour: true }}
              />
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-md mb-6'>{post.body}</p>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center space-x-4'>
            <Button className='w-18' size='sm' onClick={handleUpVote}>
              <ThumbsUp className='h-4 w-4 mr-1' />
            </Button>
            <span className='text-sm font-medium'>{post.voteScore}</span>
            <Button
              className='w-18'
              variant='destructive'
              size='sm'
              onClick={handleDownVote}
            >
              <ThumbsDown className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex items-center text-md text-muted-foreground'>
            <MessageSquare className='h-5 w-5 mr-1' />
            <span>{post.comments ? post.comments.length : 0} comments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end space-x-2'>
        <Link to={`/editpost/${post.id}`}>
          <Button size='sm'>
            <Edit className='h-4 w-4 mr-1' />
            Edit
          </Button>
        </Link>
        <Button variant='destructive' size='sm' onClick={handleDelete}>
          <Trash className='h-4 w-4 mr-1' />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryItem;
