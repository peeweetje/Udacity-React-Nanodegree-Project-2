import { Post } from '../types/post';

export const sortPosts = (posts: Post[], sortValue: string) => {
  return [...posts].sort((a: Post, b: Post) => {
    switch (sortValue) {
      case 'unpopular':
        return a.voteScore - b.voteScore;
      case 'popular':
        return b.voteScore - a.voteScore;
      case 'oldest':
        return a.timestamp - b.timestamp;
      case 'newest':
        return b.timestamp - a.timestamp;
      default:
        return 0;
    }
  });
};