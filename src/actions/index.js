import * as api from "../utils/api";

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const GET_POSTS_CATEGORY = "GET_POSTS_CATEGORY";
export const GET_SINGLE_POST = "GET_SINGLE_POST";

export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  posts
});

export const fetchPosts = () => dispatch =>
  api.getAllPosts().then(posts => dispatch(receivePosts(posts)));

export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  categories
});

export const fetchCategories = () => dispatch =>
  api
    .getAllCategories()
    .then(categories => dispatch(receiveCategories(categories)));

export const getPostsCategory = posts => ({
  type: GET_POSTS_CATEGORY,
  posts
});

export const fetchPostsCategory = category => dispatch =>
  api
    .fetchPostsCategory(category)
    .then(posts => dispatch(getPostsCategory(posts)));

export const receiveSinglePost = posts => ({
  type: GET_SINGLE_POST,
  posts
});

export const fetchSinglePost = postId => dispatch =>
  api.getSinglePost(postId).then(posts => dispatch(receiveSinglePost(posts)));
