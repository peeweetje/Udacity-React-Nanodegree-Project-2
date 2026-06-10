export interface Comment {
  id: string;
  timestamp: number;
  body: string;
  author: string;
  parentId: string;
  deleted: boolean;
  parentDeleted: boolean;
  voteScore: number;
}

export interface RootState {
  posts: {
    posts: Post[];
  };
  getComments: {
    comments: Comment[];
  };
  sort: {
    sort: {
      value: string;
    };
  };
}

interface Post {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  body: string;
  voteScore: number;
  deleted?: boolean;
  error?: string;
}