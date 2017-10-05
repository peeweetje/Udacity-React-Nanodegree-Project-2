import { combineReducers } from "redux";
import {
  RECEIVE_POSTS,
  RECEIVE_CATEGORIES,
  GET_POSTS_CATEGORY,
  GET_SINGLE_POST,
  EDIT_POST,
  DELETE_POST,
  ADD_POST,
  DELETE_COMMENT,
  EDIT_COMMENT,
  GET_COMMENTS
} from "../actions";

function receivePosts(state = {}, action) {
  switch (action.type) {
    case RECEIVE_POSTS:
      return action.posts;
    default:
      return state;
  }
}

function receiveCategories(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
}

function getPostsCategory(state = {}, action) {
  switch (action.type) {
    case GET_POSTS_CATEGORY:
      return action.posts;
    default:
      return state;
  }
}

function receivePost(state = {}, action) {
  switch (action.type) {
    case GET_SINGLE_POST:
      return action.posts;
    default:
      return state;
  }
}

function editPost(state = {}, action) {
  switch (action.type) {
    case EDIT_POST:
      return action.post;
    default:
      return state;
  }
}

function addPost(state = {}, action) {
  switch (action.type) {
    case ADD_POST:
      return action.post;
    default:
      return state;
  }
}

function deletePost(state = {}, action) {
  switch (action.type) {
    case DELETE_POST:
      return {
        ...state,
        [action.postId]: { ...state[action.postId], deleted: true }
      };
    default:
      return state;
  }
}
function getComments(state = {}, action) {
  switch (action.type) {
    case GET_COMMENTS:
      return action.comments;
    default:
      return state;
  }
}
function deleteComment(state = [], action) {
  switch (action.type) {
    case DELETE_COMMENT:
      return action.comments;
    default:
      return state;
  }
}
function editComment(state = {}, action) {
  switch (action.type) {
    case EDIT_COMMENT:
      return action.comments;
    default:
      return state;
  }
}

export default combineReducers({
  receivePosts,
  receiveCategories,
  getPostsCategory,
  receivePost,
  getComments,
  editPost,
  addPost,
  deleteComment,
  editComment,
  deletePost
});
