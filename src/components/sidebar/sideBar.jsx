import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchPostsCategory } from '../../redux/actions';
import { Sidebar, Menu, Image, Icon, Responsive } from 'semantic-ui-react';

const SideBar = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const receiveCategories = useSelector((state) => state.receiveCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getPostsByCategory = (category) => {
    dispatch(fetchPostsCategory(category));
  };

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      <Responsive
        as={Menu}
        maxWidth={767}
        className='hamburger-menu'
        size='large'
        secondary
        attached='top'
      >
        <Menu.Item onClick={toggleVisibility}>
          <Icon name='sidebar' />
          Menu
        </Menu.Item>
      </Responsive>
      <Responsive maxWidth={767} as={Image}>
        <Sidebar
          as={Menu}
          width='thin'
          animation='overlay'
          visible={visible}
          icon='labeled'
          vertical
          inverted
        >
          <Link to='/'>
            <Menu.Item className='mobile-menu-btn' name='home'>
              Home
            </Menu.Item>
          </Link>
          {receiveCategories.length > 0 &&
            receiveCategories.map((category) => (
              <Link
                onClick={() => getPostsByCategory(category.name)}
                key={category.path}
                to={`/${category.name}`}
              >
                <Menu.Item name='menu-item'>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </Menu.Item>
              </Link>
            ))}
          <Link onClick={toggleVisibility} to='#'>
            <Menu.Item className='close-btn'>
              <Icon name='close' />
            </Menu.Item>
          </Link>
        </Sidebar>
        <Sidebar.Pusher />
      </Responsive>
    </div>
  );
};

export default SideBar;
