import React from 'react';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import { Segment, List, Icon, Button, Responsive } from 'semantic-ui-react';

const CategoryItem = ({ post, onDelete, onVote }) => {
  const handleDelete = () => onDelete(post.id);
  const handleUpVote = () => onVote(post.id, 'upVote');
  const handleDownVote = () => onVote(post.id, 'downVote');

  return (
    <div className='post-wrapper-categories'>
      <List divided relaxed>
        <Segment color='teal' raised>
          <List.Item>
            <List.Content>
              <Link to={`/${post.category}/${post.id}`}>
                <List.Header className='header'>{post.title}</List.Header>
              </Link>
              <List.Content className='author'>
                <Icon name='user' color='teal' size='large' /> author:{' '}
                {post.author}
              </List.Content>
              <List.Content className='time'>
                <Icon name='clock' />
                <Timestamp time={post.timestamp / 1000} format='full' />
              </List.Content>
              <List.Content className='post-body'>{post.body}</List.Content>
              <List.Content className='votes'>
                <Icon
                  name='thumbs up outline'
                  onClick={handleUpVote}
                  color='teal'
                  size='large'
                />
                <div className='vote-score'>
                  <p className='vote-score-num'>{post.voteScore}</p>
                </div>
                <Icon
                  name='thumbs down outline'
                  color='red'
                  size='large'
                  onClick={handleDownVote}
                />
              </List.Content>
              <List.Content className='comments'>
                <Icon name='comment outline' color='teal' size='large' />
                {post.comments && post.comments.length}
              </List.Content>
            </List.Content>
          </List.Item>
          <div className='post-btn-wrapper'>
            <Responsive
              as={Button}
              onClick={handleDelete}
              compact
              basic
              color='red'
              size='tiny'
              floated='right'
            >
              <Icon name='trash' /> Delete
            </Responsive>
            <Link to={`/editpost/${post.id}`}>
              <Responsive
                as={Button}
                compact
                basic
                color='teal'
                size='tiny'
                floated='left'
              >
                <Icon name='edit' /> Edit
              </Responsive>
            </Link>
          </div>
        </Segment>
      </List>
    </div>
  );
};

export default CategoryItem;
