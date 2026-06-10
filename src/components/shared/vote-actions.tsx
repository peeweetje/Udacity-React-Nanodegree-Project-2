import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animateVoteButton } from '../animations/vote-animations';

interface VoteActionsProps {
  id: string;
  voteScore: number;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  animationsEnabled: boolean;
}

const VoteActions = ({ id, voteScore, onUpvote, onDownvote, animationsEnabled }: VoteActionsProps) => {
  return (
    <div className='flex items-center space-x-2'>
      <Button
        className='w-12 sm:w-18'
        size='sm'
        onClick={(e) => { onUpvote(id); animateVoteButton(e.currentTarget, 'up', animationsEnabled); }}
      >
        <ThumbsUp className='w-4 h-4' />
      </Button>
      <span className='font-medium dark:text-white'>{voteScore}</span>
      <Button
        className='w-12 sm:w-18'
        variant='destructive'
        size='sm'
        onClick={(e) => { onDownvote(id); animateVoteButton(e.currentTarget, 'down', animationsEnabled); }}
      >
        <ThumbsDown className='w-4 h-4' />
      </Button>
    </div>
  );
};

export default VoteActions;