import * as api from "../../utils/api";
import {
  receivePosts,
  receiveSinglePost,
  getPostsCategory,
  deletePost,
  votePost,
  addPost,
  editPost,
  receiveCategories,
  receiveComment,
  getComments,
  voteComment,
  deleteComment,
  addComment,
  editComment,
  changeSortAction
} from "../reducers";

// Re-export synchronous actions so components importing * as actions still get them
export {
  receivePosts,
  receiveSinglePost,
  getPostsCategory,
  deletePost,
  votePost,
  addPost,
  editPost,
  receiveCategories,
  receiveComment,
  getComments,
  voteComment,
  deleteComment,
  addComment,
  editComment,
  changeSortAction
};

// POST ACTIONS

// Fetch all the posts using thunk action, then fetch all the comments for a post,
// to display the number of comments for a post on the Home.
export const fetchPosts = () => (dispatch: any) =>
  api
    .getAllPosts()
    .then(posts =>
      Promise.all(
        posts.map((post: any) =>
          api
            .getComments(post.id)
            .then(comments => (post.comments = comments))
            .then(() => post)
        )
      )
    )
    .then(posts => dispatch(receivePosts(posts)));

export const fetchCategories = () => (dispatch: any) =>
  api
    .getAllCategories()
    .then(categories => dispatch(receiveCategories(categories)));

//Fetching posts for a category using thunk, then, fetching all comments for a post,
// to display the number of comments for a post on the Category Page.
export const fetchPostsCategory = (category: string) => (dispatch: any) =>
  api
    .fetchPostsCategory(category)
    .then(posts =>
      Promise.all(
        posts.map((post: any) =>
          api
            .getComments(post.id)
            .then(comments => (post.comments = comments))
            .then(() => post)
        )
      )
    )
    .then(posts => dispatch(getPostsCategory(posts)));

export const fetchSinglePost = (postId: string) => (dispatch: any) =>
  api.getSinglePost(postId).then(posts => dispatch(receiveSinglePost(posts)));

export const fetchDeletePost = (postId: string) => (dispatch: any) =>
  api.deletePost(postId).then(() => dispatch(deletePost(postId)));

export const fetchEditPost = (post: any, postId: string) => (dispatch: any) =>
  api.editPost(post, postId).then(post => dispatch(editPost(post)));

export const fetchAddPost = (post: any) => (dispatch: any) =>
  api.addPost(post).then(post => dispatch(addPost(post)));

export const fetchVotePost = (postId: string, option: string) => (dispatch: any) =>
  api.votePost(postId, option).then(post => dispatch(votePost(post)));


//COMMENT ACTIONS

export const fetchComment = (commentId: string) => (dispatch: any) =>
  api
    .getComment(commentId)
    .then(comments => dispatch(receiveComment(comments)));

export const fetchComments = (postId: string) => (dispatch: any) =>
  api.getComments(postId).then(comments => dispatch(getComments(comments)));

export const fetchDeleteComment = (commentId: string) => (dispatch: any) =>
  api
    .deleteComment(commentId)
    .then(() => dispatch(deleteComment(commentId)));

export const fetchEditComment = (comment: any, commentId: string) => (dispatch: any) =>
  api
    .editComment(comment, commentId)
    .then(comment => dispatch(editComment(comment)));

export const fetchAddComment = (comment: any) => (dispatch: any) =>
  api.addComment(comment).then(comment => dispatch(addComment(comment)));

export const fetchVoteComment = (commentId: string, option: string) => (dispatch: any) =>
  api
    .voteComment(commentId, option)
    .then(comment => dispatch(voteComment(comment)));
