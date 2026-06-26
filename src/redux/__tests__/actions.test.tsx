import { vi, describe, it, expect, beforeEach, type Mocked } from 'vitest';
import type { Comment, Post, Category, NewPost, NewComment } from '../../utils/api';
import {
  fetchPosts,
  fetchCategories,
  fetchPostsCategory,
  fetchSinglePost,
  fetchDeletePost,
  fetchEditPost,
  fetchAddPost,
  fetchVotePost,
  fetchComment,
  fetchComments,
  fetchDeleteComment,
  fetchEditComment,
  fetchAddComment,
  fetchVoteComment,
} from '../actions';

const mockDispatch = vi.fn();

vi.mock('../../utils/api', () => ({
  getAllPosts: vi.fn(() => Promise.resolve([])),
  getAllCategories: vi.fn(() => Promise.resolve([])),
  fetchPostsCategory: vi.fn(() => Promise.resolve([])),
  getSinglePost: vi.fn(() => Promise.resolve({})),
  deletePost: vi.fn(() => Promise.resolve({})),
  editPost: vi.fn(() => Promise.resolve({})),
  addPost: vi.fn(() => Promise.resolve({})),
  votePost: vi.fn(() => Promise.resolve({})),
  getComment: vi.fn(() => Promise.resolve({})),
  getComments: vi.fn(() => Promise.resolve([])),
  deleteComment: vi.fn(() => Promise.resolve({})),
  editComment: vi.fn(() => Promise.resolve({})),
  addComment: vi.fn(() => Promise.resolve({})),
  voteComment: vi.fn(() => Promise.resolve({})),
}));

import * as _api from '../../utils/api';
const api = _api as Mocked<typeof _api>;

const createThunk = (action: any) => {
  const thunk = typeof action === 'function' && action.length === 0 ? action() : action;
  return thunk(mockDispatch);
};

describe('redux actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchPosts dispatches after API call', async () => {
    api.getAllPosts.mockResolvedValue([{ id: '1', title: 'Post 1' }] as Post[]);
    await createThunk(fetchPosts);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchCategories dispatches after API call', async () => {
    api.getAllCategories.mockResolvedValue([{ path: 'general', name: 'General' }] as Category[]);
    await createThunk(fetchCategories);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchPostsCategory dispatches after API call', async () => {
    api.fetchPostsCategory.mockResolvedValue([{ id: '1' }] as Post[]);
    api.getComments.mockResolvedValue([]);
    await createThunk(fetchPostsCategory('general'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchSinglePost dispatches after API call', async () => {
    api.getSinglePost.mockResolvedValue({ id: '1', title: 'Post 1' } as Post);
    await createThunk(fetchSinglePost('1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchDeletePost dispatches after deletion', async () => {
    api.deletePost.mockResolvedValue(new Response());
    await createThunk(fetchDeletePost('1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchEditPost dispatches after API call', async () => {
    api.editPost.mockResolvedValue({ id: '1', title: 'Edited' } as Post);
    await createThunk(fetchEditPost({ title: 'Edited' }, '1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchAddPost dispatches after API call', async () => {
    api.addPost.mockResolvedValue({ id: '1', title: 'New' } as Post);
    await createThunk(fetchAddPost({ title: 'New' } as NewPost));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchVotePost dispatches after API call', async () => {
    api.votePost.mockResolvedValue({ id: '1', voteScore: 10 } as Post);
    await createThunk(fetchVotePost('1', 'upVote'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchComment dispatches after API call', async () => {
    api.getComment.mockResolvedValue({ id: '1' } as Comment);
    await createThunk(fetchComment('1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchComments dispatches after API call', async () => {
    api.getComments.mockResolvedValue([{ id: '1' }] as Comment[]);
    await createThunk(fetchComments('1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchDeleteComment dispatches after deletion', async () => {
    const deletedComment: Comment = {
      id: '1',
      parentId: '0',
      timestamp: 0,
      body: '',
      author: '',
      voteScore: 0,
      deleted: true,
      parentDeleted: false,
    };
    api.deleteComment.mockResolvedValue(deletedComment);
    await createThunk(fetchDeleteComment('1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchEditComment dispatches after API call', async () => {
    api.editComment.mockResolvedValue({ id: '1', body: 'Edited' } as Comment);
    await createThunk(fetchEditComment({ body: 'Edited' }, '1'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchAddComment dispatches after API call', async () => {
    api.addComment.mockResolvedValue({ id: '1', body: 'New' } as Comment);
    await createThunk(fetchAddComment({ body: 'New' } as NewComment));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('fetchVoteComment dispatches after API call', async () => {
    api.voteComment.mockResolvedValue({ id: '1', voteScore: 10 } as Comment);
    await createThunk(fetchVoteComment('1', 'upVote'));
    expect(mockDispatch).toHaveBeenCalled();
  });
});