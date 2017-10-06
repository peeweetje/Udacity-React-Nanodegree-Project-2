import * as api from "../utils/api";

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const GET_POSTS_CATEGORY = "GET_POSTS_CATEGORY";
export const GET_SINGLE_POST = "GET_SINGLE_POST";
export const GET_COMMENTS = "GET_COMMENTS";
export const DELETE_POST = "DELETE_POST";
export const EDIT_POST = "EDIT_POST";
export const ADD_POST = "ADD_POST";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const ADD_COMMENT = "ADD_COMMENT";
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
export const deletePost = postId => ({
  type: DELETE_POST,
  postId
});
export const fetchDeletePost = postId => dispatch =>
  api.deletePost(postId).then(post => dispatch(deletePost(postId)));

// edit post
export const editPost = (post, postId) => ({
  type: EDIT_POST,
  post,
  postId
});
export const fetchEditPost = (post, postId) => dispatch =>
  api.editPost(post, postId).then(post => dispatch(editPost(post)));

//Add post
export const addPost = post => ({
  type: ADD_POST,
  post
});
export const fetchAddPost = post => dispatch =>
  api.addPost(post).then(post => dispatch(addPost(post)));

//fetching comments
export const getComments = comments => ({
  type: GET_COMMENTS,
  comments
});
export const fetchComments = postId => dispatch =>
  api.getComments(postId).then(comments => dispatch(getComments(comments)));

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

export const addComment = comment => ({
  type: ADD_COMMENT,
  comment
});
export const fetchAddComment = comment => dispatch =>
  api.addComment(comment).then(comment => dispatch(addComment(comment)));
