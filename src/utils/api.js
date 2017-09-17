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

//works
export const getAllCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(data => data.categories);

//console.log(getAllCategories());

//returns undefined
export const getPostsCategory = category =>
  fetch(`${api}/:category/posts`, { headers })
    .then(res => res.json())
    .then(data => data.category);

//works
export const getAllPosts = () =>
  fetch(`${api}/posts`, {
    headers
  }).then(res => res.json());

//console.log(getAllPosts());

//works, but have to remove default postId later
export const getSinglePost = (postId = "8xf0y6ziyjabvozdd253nd") =>
  fetch(`${api}/posts/${postId}`, {
    headers
  }).then(res => res.json());

export const addPost = () =>
  fetch(`${api}/posts`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(res => res.json())
    .then(data => data.posts);

//Works, have to remove default postId value later.
export const getComments = (postId = "8xf0y6ziyjabvozdd253nd") =>
  fetch(`${api}/posts/${postId}/comments`, { headers }).then(response =>
    response.json()
  );

//How to test this with Postman?
/*export const addPost = (post) => {
    const body = JSON.stringify(post);
  
    return fetch(`${api}/posts/`, { method: 'POST', headers, body })
      .then(response => response.json());
  };*/

export const addComment = comment => {
  const body = JSON.stringify(comment);

  return fetch(`${api}/comments/`, {
    method: "POST",
    headers,
    body
  }).then(response => response.json());
};

export const editPost = post => {
  const body = JSON.stringify(post);

  return fetch(`${api}/posts/${post.id}`, {
    method: "PUT",
    headers,
    body
  }).then(response => response.json());
};

export const editComment = comment => {
  const body = JSON.stringify(comment);

  return fetch(`${api}/comments/${comment.id}`, {
    method: "PUT",
    headers,
    body
  }).then(response => response.json());
};

export const deletePost = postId => {
  return fetch(`${api}/posts/${postId}`, { method: "DELETE", headers });
};

export const deleteComment = commentId => {
  return fetch(`${api}/comments/${commentId}`, {
    method: "DELETE",
    headers
  }).then(response => response.json());
};

/*export const example = () =>
  fetch(`${api}/posts`, {
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ shelf })
  }).then(res => res.json());
*/
// upvotePost
// downvotePost

/*
 * Pass the downVote or upVote to the post with given `postId`.
 */
export const votePost = (postId, vote) =>
  fetch(`${api}/posts/` + postId, {
    method: `POST`,
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(vote)
  }).then(res => res.json());

//upvoteComment
//downvoteComment
