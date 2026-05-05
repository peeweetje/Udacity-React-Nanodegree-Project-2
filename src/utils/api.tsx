import type { Post } from "@/types/post";

const api = "http://localhost:5001";

// Generate a unique token for storing data on the backend server.
let token: string = localStorage.token;
if (!token)
  token = localStorage.token = Math.random()
    .toString(36)
    .substr(-8);

const headers: Record<string, string> = {
  Accept: "application/json",
  Authorization: token,
  "Content-Type": "application/json",
};

export interface Category {
  path: string;
  name: string;
}

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

export interface NewPost {
  title: string;
  author: string;
  body: string;
  category: string;
}

export interface NewComment {
  id: string;
  parentId: string;
  timestamp: number;
  body: string;
  author: string;
}

export type VoteOption = "upVote" | "downVote";

export const getAllCategories = (): Promise<Category[]> =>
  fetch(`${api}/categories`, { headers })
    .then((res: Response) => res.json())
    .then((data: { categories: Category[] }) => data.categories);

export const fetchPostsCategory = (category: string): Promise<Post[]> =>
  fetch(`${api}/${category}/posts`, { headers }).then((data: Response) => data.json());

export const getAllPosts = (): Promise<Post[]> =>
  fetch(`${api}/posts`, {
    headers,
  }).then((res: Response) => res.json());

export const getSinglePost = (postId: string): Promise<Post> =>
  fetch(`${api}/posts/${postId}`, {
    headers,
  }).then((res: Response) => res.json());

export const addPost = (post: NewPost): Promise<Post> =>
  fetch(`${api}/posts`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((data: Response) => data.json());

export const editPost = (post: Partial<Post>, postId: string): Promise<Post> => {
  return fetch(`${api}/posts/${postId}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((data: Response) => data.json());
};

export const deletePost = (postId: string): Promise<Response> => {
  return fetch(`${api}/posts/${postId}`, {
    method: "DELETE",
    headers,
  });
};

//get a single comment for editing the comment
export const getComment = (commentId: string): Promise<Comment> =>
  fetch(`${api}/comments/${commentId}`, { headers }).then((res: Response) =>
    res.json().then((data: Comment) => data)
  );

//get comments for a post
export const getComments = (postId: string): Promise<Comment[]> =>
  fetch(`${api}/posts/${postId}/comments`, { headers }).then((response: Response) =>
    response.json().then((data: Comment[]) => data)
  );

export const addComment = (comment: NewComment): Promise<Comment> => {
  const body = JSON.stringify(comment);

  return fetch(`${api}/comments/`, {
    method: "POST",
    headers,
    body,
  }).then((response: Response) => response.json());
};

export const editComment = (comment: Partial<Comment>, commentId: string): Promise<Comment> => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  }).then((data: Response) => data.json());
};

export const deleteComment = (commentId: string): Promise<Comment> => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "DELETE",
    headers,
  }).then((response: Response) => response.json());
};

/*
 * Pass the downVote or upVote to the post with given `postId`.
 */
export const votePost = (postId: string, option: VoteOption): Promise<Post> =>
  fetch(`${api}/posts/${postId}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ option }),
  }).then((res: Response) => res.json());

//upvoteComment
//downvoteComment

export const voteComment = (commentId: string, option: VoteOption): Promise<Comment> => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: option,
    }),
  }).then((data: Response) => data.json());
};