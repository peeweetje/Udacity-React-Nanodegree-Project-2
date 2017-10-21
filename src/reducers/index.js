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
  GET_COMMENT,
  GET_COMMENTS,
  ADD_COMMENT,
  VOTE,
  VOTE_COMMENT,
  CHANGE_SORT
} from "../actions";

function posts(state = {}, action) {
  switch (action.type) {
    case RECEIVE_POSTS:
      return { ...state, posts: action.posts };
    case GET_SINGLE_POST:
      return { ...state, posts: [action.posts] };
    case GET_POSTS_CATEGORY:
      return { ...state, posts: action.posts };
    case DELETE_POST:
      const availablePosts = state.posts.filter(
        item => item.id !== action.postId
      );
      return {
        ...state,
        posts: availablePosts
      };
    case VOTE:
      const updatedPosts = state.posts.map(item => {
        if (item.id === action.payload.id) {
          item.voteScore = action.payload.voteScore;
        }
        return item;
      });
      return {
        ...state,
        posts: updatedPosts
      };
    case ADD_POST:
      return { ...state, ...action.post };
    case EDIT_POST:
      return { ...state, ...action.post };

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

function receiveComment(state = {}, action) {
  switch (action.type) {
    case GET_COMMENT:
      return action.comments;
    default:
      return state;
  }
}

function getComments(state = {}, action) {
  switch (action.type) {
    case GET_COMMENTS:
      return { ...state, comments: action.comments };
    case VOTE_COMMENT:
      const updatedComments = state.comments.map(item => {
        if (item.id === action.commentId.id) {
          item.voteScore = action.commentId.voteScore;
        }
        return item;
      });
      return {
        ...state,
        comments: updatedComments
      };
    case DELETE_COMMENT:
      const availableComments = state.comments.filter(
        item => item.id !== action.commentId
      );
      return {
        ...state,
        comments: availableComments
      };
    case ADD_COMMENT:
      return { ...state, comments: state.comments.concat(action.comment) };
    case EDIT_COMMENT:
      return { ...state, ...action.comment };
    default:
      return state;
  }
}

function sort(state = { sort: "popular" }, action) {
  switch (action.type) {
    case CHANGE_SORT:
      const newValue = action.value;
      return {
        ...state,
        sort: newValue
      };
    default:
      return state;
  }
}

export default combineReducers({
  posts,
  receiveCategories,
  receiveComment,
  getComments,
  sort
});
