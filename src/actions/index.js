import * as api from "../utils/api";

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const GET_POSTS_CATEGORY = "GET_POSTS_CATEGORY";
export const GET_SINGLE_POST = "GET_SINGLE_POST";
export const GET_COMMENTS = "GET_COMMENTS";
export const DELETE_POST = "DELETE_POST";
export const EDIT_POST = "EDIT_POST";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
//fetching posts
export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  posts
});

export const fetchPosts = () => dispatch =>
  api.getAllPosts().then(posts => dispatch(receivePosts(posts)));
// fetching all categories
export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  categories
});

export const fetchCategories = () => dispatch =>
  api
    .getAllCategories()
    .then(categories => dispatch(receiveCategories(categories)));
//fetching post categories
export const getPostsCategory = posts => ({
  type: GET_POSTS_CATEGORY,
  posts
});

export const fetchPostsCategory = category => dispatch =>
  api
    .fetchPostsCategory(category)
    .then(posts => dispatch(getPostsCategory(posts)));
//fetching single post
export const receiveSinglePost = posts => ({
  type: GET_SINGLE_POST,
  posts
});

export const fetchSinglePost = postId => dispatch =>
  api.getSinglePost(postId).then(posts => dispatch(receiveSinglePost(posts)));

//Deleting post

// edit post
export const editPost = posts => ({
  type: EDIT_POST,
  posts
});

export const fetchEditPost = postId => dispatch =>
  api.editPost(postId).then(posts => dispatch(editPost(posts)));

//fetching comments
export const getComments = comments => ({
  type: GET_COMMENTS,
  comments
});

export const fetchComments = commentId => dispatch =>
  api.getComments(commentId).then(comments => dispatch(getComments(comments)));

// delete comment
export const deleteComment = comments => ({
  type: DELETE_COMMENT,
  comments
});
export const fetchDeleteComment = commentId => dispatch =>
  api
    .deleteComment(commentId)
    .then(comments => dispatch(deleteComment(comments)));

// edit comment
export const editComment = comments => ({
  type: EDIT_COMMENT,
  comments
});

export const fetchEditComment = commentId => dispatch =>
  api.editComment(commentId).then(comments => dispatch(editComment(comments)));
