import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './home-page/home-page';
import DashboardPage from './dashboard-page/dashboard-page';
import NotificationsPage from './dashboard-page/notifications-page';
import MessagesPage from './dashboard-page/messages-page';
import SettingsPage from './dashboard-page/settings-page';
import PostsPage from './posts-page/posts-page';
import AllCategories from './all-categories/all-categories';
import PostDetail from './post-details/post-detail';
import EditPost from './edit-post/edit-post';
import EditComment from './edit-comment/edit-comment';
import AddPost from './add-post/add-post';
import ProfilePage from './dashboard-page/profile-page/profile-page';
import AnimatedOrbs from './ui/animated-orbs';

import '../index.css';

const App = () => {
  return (
    <>
      <AnimatedOrbs />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<DashboardPage />} />
        <Route path='/notifications' element={<NotificationsPage />} />
        <Route path='/messages' element={<MessagesPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/posts' element={<PostsPage />} />
        <Route path='/addPost' element={<AddPost />} />
        <Route path='/:category/' element={<AllCategories />} />
        <Route path='/editPost/:postId' element={<EditPost />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/editComment/:commentId' element={<EditComment />} />
        <Route path='/:category/:post_id' element={<PostDetail />} />
      </Routes>
    </>
  );
};

export default App;
