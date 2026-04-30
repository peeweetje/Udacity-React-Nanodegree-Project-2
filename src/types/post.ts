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