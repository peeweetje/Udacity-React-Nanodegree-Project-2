import { createSlice, combineReducers } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: { posts: [] } as any,
  reducers: {
    receivePosts: (state, action) => {
      state.posts = action.payload;
    },
    receiveSinglePost: (state, action) => {
      state.posts = [action.payload];
    },
    getPostsCategory: (state, action) => {
      state.posts = action.payload;
    },
    deletePost: (state, action) => {
      if (state.posts) {
        state.posts = state.posts.filter((item: any) => item.id !== action.payload);
      }
    },
    votePost: (state, action) => {
      if (state.posts) {
        const item = state.posts.find((i: any) => i.id === action.payload.id);
        if (item) {
          item.voteScore = action.payload.voteScore;
        }
      }
    },
    addPost: (state, action) => {
      if (state.posts) {
        state.posts.push(action.payload);
      } else {
        state.posts = [action.payload];
      }
    },
    editPost: (state, action) => {
      if (state.posts) {
        const index = state.posts.findIndex((i: any) => i.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          state.posts.push(action.payload);
        }
      } else {
        state.posts = [action.payload];
      }
    }
  }
});

export const {
  receivePosts,
  receiveSinglePost,
  getPostsCategory,
  deletePost,
  votePost,
  addPost,
  editPost
} = postsSlice.actions;

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {
    receiveCategories: (_state, action) => action.payload,
  }
});

export const { receiveCategories } = categoriesSlice.actions;

const commentSlice = createSlice({
  name: 'comment',
  initialState: [],
  reducers: {
    receiveComment: (_state, action) => action.payload,
  }
});

export const { receiveComment } = commentSlice.actions;

const commentsSlice = createSlice({
  name: 'comments',
  initialState: { comments: [] } as any,
  reducers: {
    getComments: (state, action) => {
      state.comments = action.payload;
    },
    voteComment: (state, action) => {
      if (state.comments) {
        const item = state.comments.find((i: any) => i.id === action.payload.id);
        if (item) {
          item.voteScore = action.payload.voteScore;
        }
      }
    },
    deleteComment: (state, action) => {
      if (state.comments) {
        state.comments = state.comments.filter((item: any) => item.id !== action.payload);
      }
    },
    addComment: (state, action) => {
      if (state.comments) {
        state.comments.push(action.payload);
      } else {
        state.comments = [action.payload];
      }
    },
    editComment: (state, action) => {
      if (state.comments) {
        const index = state.comments.findIndex((i: any) => i.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        } else {
          state.comments.push(action.payload);
        }
      } else {
        state.comments = [action.payload];
      }
    }
  }
});

export const { getComments, voteComment, deleteComment, addComment, editComment } = commentsSlice.actions;

const sortSlice = createSlice({
  name: 'sort',
  initialState: { sort: "popular" } as any,
  reducers: {
    changeSortAction: (state, action) => {
      state.sort = action.payload;
    }
  }
});

export const { changeSortAction } = sortSlice.actions;

export default combineReducers({
  posts: postsSlice.reducer,
  receiveCategories: categoriesSlice.reducer,
  receiveComment: commentSlice.reducer,
  getComments: commentsSlice.reducer,
  sort: sortSlice.reducer,
});
