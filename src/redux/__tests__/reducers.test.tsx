import { describe, it, expect } from 'vitest';
import rootReducer, {
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
  changeSortAction,
  toggleAnimations,
} from '../reducers';

describe('rootReducer', () => {
  it('should return initial state with default values', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toBeDefined();
    expect(state.posts).toEqual({ posts: [] });
    expect(state.receiveCategories).toEqual([]);
    expect(state.receiveComment).toEqual([]);
    expect(state.getComments).toEqual({ comments: [] });
    expect(state.sort).toEqual({ sort: { value: 'popular' } });
    expect(state.animations).toEqual({ enabled: true });
  });

  it('should handle receivePosts', () => {
    const posts = [
      { id: '1', title: 'Post 1', voteScore: 5, comments: [] },
      { id: '2', title: 'Post 2', voteScore: 10, comments: [] },
    ];
    const state = rootReducer(undefined, receivePosts(posts));
    expect(state.posts.posts).toEqual(posts);
  });

  it('should handle receiveSinglePost', () => {
    const post = { id: '1', title: 'Post 1', voteScore: 5, comments: [] };
    const state = rootReducer(undefined, receiveSinglePost(post));
    expect(state.posts.posts).toEqual([post]);
  });

  it('should handle getPostsCategory', () => {
    const posts = [{ id: '1', title: 'Post 1', voteScore: 5, comments: [] }];
    const state = rootReducer(undefined, getPostsCategory(posts));
    expect(state.posts.posts).toEqual(posts);
  });

  it('should handle deletePost', () => {
    const initialState = {
      posts: { posts: [
        { id: '1', title: 'Post 1', voteScore: 5, comments: [] },
        { id: '2', title: 'Post 2', voteScore: 10, comments: [] },
      ]},
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const state = rootReducer(initialState, deletePost('1'));
    expect(state.posts.posts).toHaveLength(1);
    expect(state.posts.posts[0].id).toBe('2');
  });

  it('should handle votePost', () => {
    const initialState = {
      posts: { posts: [{ id: '1', voteScore: 5 }] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const state = rootReducer(initialState, votePost({ id: '1', voteScore: 10 }));
    expect(state.posts.posts[0].voteScore).toBe(10);
  });

  it('should handle addPost', () => {
    const initialState = {
      posts: { posts: [{ id: '1', title: 'Post 1', voteScore: 5, comments: [] }] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const newPost = { id: '2', title: 'Post 2', voteScore: 0, comments: [] };
    const state = rootReducer(initialState, addPost(newPost));
    expect(state.posts.posts).toHaveLength(2);
    expect(state.posts.posts[1]).toEqual(newPost);
  });

  it('should handle addPost when posts is null', () => {
    const initialState = {
      posts: { posts: null as any },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const newPost = { id: '1', title: 'Post 1', voteScore: 5, comments: [] };
    const state = rootReducer(initialState, addPost(newPost));
    expect(state.posts.posts).toEqual([newPost]);
  });

  it('should handle editPost when post exists', () => {
    const initialState = {
      posts: { posts: [{ id: '1', title: 'Post 1', voteScore: 5, comments: [] }] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const editedPost = { id: '1', title: 'Edited Post', voteScore: 5, comments: [] };
    const state = rootReducer(initialState, editPost(editedPost));
    expect(state.posts.posts[0].title).toBe('Edited Post');
  });

  it('should handle editPost when post does not exist', () => {
    const initialState = {
      posts: { posts: [{ id: '1', title: 'Post 1', voteScore: 5, comments: [] }] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const newPost = { id: '2', title: 'Post 2', voteScore: 0, comments: [] };
    const state = rootReducer(initialState, editPost(newPost));
    expect(state.posts.posts).toHaveLength(2);
  });

  it('should handle receiveCategories', () => {
    const categories = [{ path: 'general', name: 'General' }];
    const state = rootReducer(undefined, receiveCategories(categories));
    expect(state.receiveCategories).toEqual(categories);
  });

  it('should handle receiveComment', () => {
    const comment = { id: '1', body: 'Comment 1' };
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const state = rootReducer(initialState, receiveComment(comment));
    expect(state.receiveComment).toEqual(comment);
  });

  it('should handle getComments', () => {
    const comments = [
      { id: '1', body: 'Comment 1', voteScore: 5 },
      { id: '2', body: 'Comment 2', voteScore: 10 },
    ];
    const state = rootReducer(undefined, getComments(comments));
    expect(state.getComments.comments).toEqual(comments);
  });

  it('should handle voteComment', () => {
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [{ id: '1', voteScore: 5 }] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const state = rootReducer(initialState, voteComment({ id: '1', voteScore: 10 }));
    expect(state.getComments.comments[0].voteScore).toBe(10);
  });

  it('should handle deleteComment', () => {
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [
        { id: '1', body: 'Comment 1', voteScore: 5 },
        { id: '2', body: 'Comment 2', voteScore: 10 },
      ]},
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const state = rootReducer(initialState, deleteComment('1'));
    expect(state.getComments.comments).toHaveLength(1);
    expect(state.getComments.comments[0].id).toBe('2');
  });

  it('should handle addComment', () => {
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [{ id: '1', body: 'Comment 1', voteScore: 5 }] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const newComment = { id: '2', body: 'Comment 2', voteScore: 0 };
    const state = rootReducer(initialState, addComment(newComment));
    expect(state.getComments.comments).toHaveLength(2);
    expect(state.getComments.comments[1]).toEqual(newComment);
  });

  it('should handle editComment when comment exists', () => {
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [{ id: '1', body: 'Comment 1', voteScore: 5 }] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const editedComment = { id: '1', body: 'Edited Comment', voteScore: 5 };
    const state = rootReducer(initialState, editComment(editedComment));
    expect(state.getComments.comments[0].body).toBe('Edited Comment');
  });

  it('should handle editComment when comment does not exist', () => {
    const initialState = {
      posts: { posts: [] },
      receiveCategories: [],
      receiveComment: [],
      getComments: { comments: [{ id: '1', body: 'Comment 1', voteScore: 5 }] },
      sort: { sort: { value: 'popular' } },
      animations: { enabled: true },
    };
    const newComment = { id: '2', body: 'Comment 2', voteScore: 0 };
    const state = rootReducer(initialState, editComment(newComment));
    expect(state.getComments.comments).toHaveLength(2);
  });

  it('should handle changeSortAction', () => {
    const state = rootReducer(undefined, changeSortAction({ value: 'latest' }));
    expect(state.sort.sort.value).toBe('latest');
  });

  it('should handle toggleAnimations to false', () => {
    const state = rootReducer(undefined, toggleAnimations(false));
    expect(state.animations.enabled).toBe(false);
  });

  it('should handle toggleAnimations to true', () => {
    const state = rootReducer(undefined, toggleAnimations(true));
    expect(state.animations.enabled).toBe(true);
  });
});