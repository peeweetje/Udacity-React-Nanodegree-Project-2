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

function receivePosts(state = {}, action) {
  switch (action.type) {
    case RECEIVE_POSTS:
      return { ...state, posts: action.posts };
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

/*function getPostsCategory(state = {}, action) {
  switch (action.type) {
    case GET_POSTS_CATEGORY:
      return action.posts;
    default:
      return state;
  }
}*/

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

/*function deletePost(state = {}, action) {
  switch (action.type) {
    case DELETE_POST:
      return {
        ...state,
        [action.postId]: { ...state[action.postId], deleted: true }
      };
    default:
      return state;
  }
}*/

/*function votePost(state = {}, action) {
  switch (action.type) {
    case VOTE:
      return action.postId;
    default:
      return state;
  }
}*/

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
      return action.comments;
    default:
      return state;
  }
}
function deleteComment(state = [], action) {
  switch (action.type) {
    case DELETE_COMMENT:
      return action.commentId;
    default:
      return state;
  }
}
function editComment(state = {}, action) {
  switch (action.type) {
    case EDIT_COMMENT:
      return action.comment;
    default:
      return state;
  }
}

function addComment(state = {}, action) {
  switch (action.type) {
    case ADD_COMMENT:
      return action.comment;
    default:
      return state;
  }
}

function voteComment(state = {}, action) {
  switch (action.type) {
    case VOTE_COMMENT:
      return action.commentId;
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
  receivePosts,
  receiveCategories,
  //getPostsCategory,
  receivePost,
  receiveComment,
  getComments,
  editPost,
  addPost,
  deleteComment,
  editComment,
  addComment,
  //deletePost,
  //votePost,
  voteComment,
  sort
});
