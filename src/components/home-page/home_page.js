import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import Menu from '../menu/menu';
import SideBar from '../sidebar/sideBar';
import * as actions from '../../redux/actions';
import { sortPosts } from '../../utils/sortPosts';
import {
  List,
  Header,
  Button,
  Segment,
  Icon,
  Responsive,
} from 'semantic-ui-react';

import './home-page.scss';

const HomePage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const sort = useSelector((state) => state.sort.sort);

  useEffect(() => {
    // Fetch posts to display on Home Page
    dispatch(actions.fetchPosts());
  }, [dispatch]);

  const deletePost = (postId) => {
    dispatch(actions.fetchDeletePost(postId));
  };

  const iconThumbsUp = (postId) => {
    dispatch(actions.fetchVotePost(postId, 'upVote'));
  };

  const iconThumbsDown = (postId) => {
    dispatch(actions.fetchVotePost(postId, 'downVote'));
  };

  return (
    <div className='page-wrapper'>
      <SideBar />
      <div className='content-wrapper'>
        <div className='container'>
          <div className='header-section'>
            <Header textAlign='center' color='teal' as='h1'>
              Git Talks
            </Header>
          </div>
          <Menu />
        </div>

        <div className='post-container'>
          {/* Check if posts exist, then filter, sort, and map over the posts to display them on the HomePage */}
          {posts &&
            posts.length > 0 &&
            sortPosts(
              posts.filter((post) => !post.deleted),
              sort.value
            ).map((post) => (
              <List key={post.id} divided relaxed>
                <Segment color='teal' raised>
                  <List.Item>
                    <List.Content>
                      <Link to={`/${post.category}/${post.id}`}>
                        <List.Header>{post.title}</List.Header>
                      </Link>
                      <List.Content className='author'>
                        <Icon name='user' color='teal' size='large' />
                        {post.author}
                      </List.Content>
                      <List.Content className='time'>
                        <Icon name='clock' color='teal' size='large' />
                        <Timestamp
                          options={{ twentyFourHour: true }}
                          date={post.timestamp / 1000}
                        />
                      </List.Content>
                      <List.Content className='votes'>
                        <Icon
                          name='thumbs up outline'
                          color='teal'
                          size='large'
                          onClick={() => iconThumbsUp(post.id)}
                        />
                        <div className='vote-score'>
                          <p className='vote-score-num'>{post.voteScore}</p>
                        </div>
                        <Icon
                          name='thumbs down outline'
                          color='red'
                          size='large'
                          onClick={() => iconThumbsDown(post.id)}
                        />
                      </List.Content>
                      <List.Content className='comments' key={post.id}>
                        <Icon
                          name='comment outline'
                          color='teal'
                          size='large'
                        />
                        {post.comments && post.comments.length}
                      </List.Content>
                    </List.Content>
                  </List.Item>
                  <div className='post-btn-wrapper'>
                    <Responsive
                      as={Button}
                      onClick={() => deletePost(post.id)}
                      compact
                      basic
                      color='red'
                      size='tiny'
                      floated='right'
                      maxWidth={400}
                    >
                      <Icon name='trash' />
                      Delete
                    </Responsive>
                    <Responsive
                      as={Button}
                      onClick={() => deletePost(post.id)}
                      compact
                      basic
                      color='red'
                      size='tiny'
                      floated='right'
                      minWidth={401}
                    >
                      <Icon name='trash' />
                      Delete post
                    </Responsive>

                    <Link to={`/editpost/${post.id}`}>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='teal'
                        size='tiny'
                        floated='left'
                        maxWidth={400}
                      >
                        <Icon name='edit' />
                        Edit
                      </Responsive>
                      <Responsive
                        as={Button}
                        compact
                        basic
                        color='teal'
                        size='tiny'
                        floated='right'
                        minWidth={401}
                      >
                        <Icon name='edit' />
                        Edit post
                      </Responsive>
                    </Link>
                  </div>
                </Segment>
              </List>
            ))}
          <div className='btn-add'>
            <Link to='/addpost'>
              <Button compact color='teal' size='large'>
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

export default HomePage;
