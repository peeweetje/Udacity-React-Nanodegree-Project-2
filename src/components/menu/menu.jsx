import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchPostsCategory } from '../../redux/actions';
import SortBy from '../sort-by/sortBy';
import { Grid, Button, Responsive } from 'semantic-ui-react';

const Menu = () => {
  const dispatch = useDispatch();
  const receiveCategories = useSelector((state) => state.receiveCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getPostsByCategory = (category) => {
    dispatch(fetchPostsCategory(category));
  };

  return (
    <div className='categories'>
      <Responsive as={Grid} columns={6} minWidth={768}>
        <Grid.Column>
          <Link to='/'>
            <Button className='menu-btn' size='tiny' compact basic color='teal'>
              All
            </Button>
          </Link>
        </Grid.Column>
        {receiveCategories.length > 0 &&
          receiveCategories.map((category) => (
            <Grid.Column key={category.path}>
              <Link to={`/${category.name}`}>
                <Button
                  className='menu-btn'
                  onClick={() => getPostsByCategory(category.name)}
                  size='tiny'
                  compact
                  basic
                  color='teal'
                >
                  {category.name}
                </Button>
              </Link>
            </Grid.Column>
          ))}
        <Grid.Column>
          <SortBy />
        </Grid.Column>
      </Responsive>
      <Responsive as={Grid} columns={1} maxWidth={767}>
        <SortBy />
      </Responsive>
    </div>
  );
};

export default Menu;
