const api = "http://localhost:5001";

// Generate a unique token for storing data on the backend server.
let token = localStorage.token;
if (!token)
  token = localStorage.token = Math.random()
    .toString(36)
    .substr(-8);

const headers = {
  Accept: "application/json",
  Authorization: token,
  "Content-Type": "application/json"
};

export const getAllCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(data => data.categories);

export const fetchPostsCategory = category =>
  fetch(`${api}/${category}/posts`, { headers }).then(data => data.json());

export const getAllPosts = () =>
  fetch(`${api}/posts`, {
    headers
  }).then(res => res.json());

export const getSinglePost = postId =>
  fetch(`${api}/posts/${postId}`, {
    headers
  }).then(res => res.json());

export const addPost = post =>
  fetch(`${api}/posts`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  }).then(data => data.json());

export const editPost = (post, postId) => {
  return fetch(`${api}/posts/${postId}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  }).then(data => data.json());
};

export const deletePost = postId => {
  return fetch(`${api}/posts/${postId}`, {
    method: "DELETE",
    headers
  }).then(res => res);
};

//get a single comment for editing the comment
export const getComment = commentId =>
  fetch(`${api}/comments/${commentId}`, { headers }).then(res =>
    res.json().then(data => data)
  );

//get comments for a post
export const getComments = postId =>
  fetch(`${api}/posts/${postId}/comments`, { headers }).then(response =>
    response.json().then(data => data)
  );

export const addComment = comment => {
  const body = JSON.stringify(comment);

  return fetch(`${api}/comments/`, {
    method: "POST",
    headers,
    body
  }).then(response => response.json());
};

export const editComment = (comment, commentId) => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  }).then(data => data.json());
};

export const deleteComment = commentId => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "DELETE",
    headers
  }).then(response => response.json());
};

/*
 * Pass the downVote or upVote to the post with given `postId`.
 */
export const votePost = (postId, option) =>
  fetch(`${api}/posts/${postId}`, {
    method: `POST`,
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ option })
  }).then(res => res.json());
// .then(data => data);

//upvoteComment
//downvoteComment

export const voteComment = (commentId, option) => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      option: option
    })
  }).then(data => data.json());
};
