export interface Comment {
  id: string;
  parentId: string;
  timestamp: number;
  body: string;
  author: string;
  voteScore: number;
  deleted: boolean;
  parentDeleted: boolean;
}

export interface NewComment {
  id: string;
  parentId: string;
  timestamp: number;
  body: string;
  author: string;
}