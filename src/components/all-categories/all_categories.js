import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CategoryItem from '../category-item/catergory-item';
import Menu from '../menu/menu';
import SideBar from '../sidebar/sideBar';
import * as actions from '../../redux/actions';
import { Header, Icon, Button, Message } from 'semantic-ui-react';
import './all-categories.scss';

const Categories = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { sort } = useSelector((state) => state.sort);
  const { category: categoryName } = useParams();

  useEffect(() => {
    dispatch(actions.fetchPostsCategory(categoryName));
  }, [categoryName, dispatch]);

  const handleDeletePost = (postId) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const handleVotePost = (postId, option) => {
    dispatch(actions.fetchVotePost(postId, option));
  };

  const formattedCategoryName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='category-page-container'>
        <div className='header-section-categories'>
          <Header textAlign='center' color='teal' as='h1'>
            Git Talks
          </Header>
          <Menu />
          <div className='category-message-wrapper'>
            <Message color='teal' size='small' className='header-categories'>
              Category: {formattedCategoryName}
            </Message>
          </div>
        </div>

        <div>
          {posts && posts.length > 0 ? (
            posts
              .filter((post) => !post.deleted && !post.error)
              .sort((a, b) => {
                switch (sort.value) {
                  case 'unpopular':
                    return a.voteScore - b.voteScore;
                  case 'oldest':
                    return a.timestamp - b.timestamp;
                  case 'newest':
                    return b.timestamp - a.timestamp;
                  default:
                    return b.voteScore - a.voteScore;
                }
              })
              .map((post) => (
                <CategoryItem
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onVote={handleVotePost}
                />
              ))
          ) : (
            <div className='no-posts'>
              <h3 className='empty-category'>
                There are no posts in this category.
              </h3>
            </div>
          )}
          <div className='add-btn-post'>
            <Link to='/addpost'>
              <Button compact color='teal' size='large' floated='right'>
                <Icon name='plus circle' />
                Add Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
