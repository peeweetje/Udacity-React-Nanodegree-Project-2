import * as api from "../utils/api";

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const GET_POSTS_CATEGORY = "GET_POSTS_CATEGORY";
export const GET_SINGLE_POST = "GET_SINGLE_POST";
export const GET_COMMENT = "GET_COMMENT";
export const GET_COMMENTS = "GET_COMMENTS";
export const DELETE_POST = "DELETE_POST";
export const EDIT_POST = "EDIT_POST";
export const ADD_POST = "ADD_POST";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const ADD_COMMENT = "ADD_COMMENT";
export const VOTE = "VOTE";
export const VOTE_COMMENT = "VOTE_COMMENT";
export const CHANGE_SORT = "CHANGE_SORT";
export const DELETE_SINGLE_POST = "DELETE_SINGLE_POST";

//Thunk is used to handle asynchronous actions in Redux

//POST ACTIONS
//fetching all posts
export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  posts
});

//Fetch all the posts using thunk action, then fetch all the comments for a post,
// to display the number of comments for a post on the Home.
export const fetchPosts = () => dispatch =>
  api
    .getAllPosts()
    .then(posts =>
      Promise.all(
        posts.map(post =>
          api
            .getComments(post.id)
            .then(comments => (post.comments = comments))
            .then(() => post)
        )
      )
    )
    .then(posts => dispatch(receivePosts(posts)));

// fetching all categories, to display in a menu
export const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  categories
});
export const fetchCategories = () => dispatch =>
  api
    .getAllCategories()
    .then(categories => dispatch(receiveCategories(categories)));

//fetching posts for a category, to display posts on Category Page
export const getPostsCategory = posts => ({
  type: GET_POSTS_CATEGORY,
  posts
});

//Fetching posts for a category using thunk, then, fetching all comments for a post,
// to display the number of comments for a post on the Category Page.
export const fetchPostsCategory = category => dispatch =>
  api
    .fetchPostsCategory(category)
    .then(posts =>
      Promise.all(
        posts.map(post =>
          api
            .getComments(post.id)
            .then(comments => (post.comments = comments))
            .then(() => post)
        )
      )
    )
    .then(posts => dispatch(getPostsCategory(posts)));

//fetching a single post
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

// Upvote post
//export const votePost = (postId, option) => ({
// type: VOTE,
// postId
//});

export const votePost = post => ({
  type: VOTE,
  payload: post
});

export const fetchVotePost = (postId, option) => dispatch =>
  api.votePost(postId, option).then(post => dispatch(votePost(post)));

//COMMENT ACTIONS
//fetch comment for editing
export const receiveComment = comments => ({
  type: GET_COMMENT,
  comments
});

export const fetchComment = commentId => dispatch =>
  api
    .getComment(commentId)
    .then(comments => dispatch(receiveComment(comments)));

//fetching all comments gor a post
export const getComments = comments => ({
  type: GET_COMMENTS,
  comments
});
export const fetchComments = postId => dispatch =>
  api.getComments(postId).then(comments => dispatch(getComments(comments)));

// delete comment
export const deleteComment = commentId => ({
  type: DELETE_COMMENT,
  commentId
});
export const fetchDeleteComment = commentId => dispatch =>
  api
    .deleteComment(commentId)
    .then(comment => dispatch(deleteComment(commentId)));

// edit comment
export const editComment = (comment, commentId) => ({
  type: EDIT_COMMENT,
  comment,
  commentId
});

export const fetchEditComment = (comment, commentId) => dispatch =>
  api
    .editComment(comment, commentId)
    .then(comment => dispatch(editComment(comment)));

//add commment
export const addComment = comment => ({
  type: ADD_COMMENT,
  comment
});
export const fetchAddComment = comment => dispatch =>
  api.addComment(comment).then(comment => dispatch(addComment(comment)));

//vote comment

export const voteComment = (commentId, option) => ({
  type: VOTE_COMMENT,
  commentId
});

export const fetchVoteComment = (commentId, option) => dispatch =>
  api
    .voteComment(commentId, option)
    .then(comment => dispatch(voteComment(comment)));

//Change sort post and sort comment
export const changeSortAction = value => {
  return {
    type: CHANGE_SORT,
    value: value
  };
};
