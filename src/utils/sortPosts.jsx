export const sortPosts = (posts, sortValue) => {
  return posts.sort((a, b) => {
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
