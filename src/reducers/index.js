import { combineReducers } from "redux";
import {
  RECEIVE_POSTS,
  RECEIVE_CATEGORIES
  //GET_POSTS_CATEGORY
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

export default combineReducers({
  receivePosts,
  receiveCategories
});
