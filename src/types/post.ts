export interface Post {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  body: string;
  voteScore: number;
  category: string;
  deleted: boolean;
  error: boolean;
  comments?: Array<any>;
}

export interface NewPost {
  title: string;
  author: string;
  body: string;
  category: string;
}

export interface PostData {
  id: string;
  timestamp: number;
  title: string;
  body: string;
  author: string;
  category: string;
  deleted: boolean;
  voteScore: number;
}

export interface UpdatePost {
  id?: string;
  title?: string;
  body?: string;
  author?: string;
  category?: string;
}