import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './home-page/home_page';
import AllCategories from './all-categories/all_categories';
import PostDetail from './post-details/post_detail';
import EditPost from './edit-post/edit_post';
import EditComment from './edit-comment/edit_comment';
import AddPost from './add-post/add_post';

import '../App.scss';

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
