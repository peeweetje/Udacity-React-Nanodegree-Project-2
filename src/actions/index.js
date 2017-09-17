import * as api from "../utils/api";

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
//export const GET_POSTS_CATEGORY = "GET_POSTS_CATEGORY";

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
