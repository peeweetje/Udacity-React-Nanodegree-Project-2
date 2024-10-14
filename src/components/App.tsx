import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './home-page/home-page';
import AllCategories from './all-categories/all-categories';
import PostDetail from './post-details/post-detail';
import EditPost from './edit-post/edit-post';
import EditComment from './edit-comment/edit-comment';
import AddPost from './add-post/add-post';

import '../index.css';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/addPost' element={<AddPost />} />
      <Route path='/:category/' element={<AllCategories />} />
      <Route path='/editPost/:postId' element={<EditPost />} />
      <Route path='/editComment/:commentId' element={<EditComment />} />
      <Route path='/:category/:post_id' element={<PostDetail />} />
    </Routes>
  );
};

export default App;
