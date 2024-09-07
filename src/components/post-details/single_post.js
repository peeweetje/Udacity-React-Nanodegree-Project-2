import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import { Segment, List, Icon, Button, Responsive } from 'semantic-ui-react';

const SinglePost = ({
  post,
  commentsCount,
  onUpvote,
  onDownvote,
  onDelete,
}) => {
  const { id, title, author, timestamp, body, voteScore } = post;

  return (
    <div className='post-wrapper'>
      <Segment color='teal' raised>
        <h3 className='title'>{title}</h3>
        <List.Content className='author'>
          <Icon name='user' color='teal' size='large' />
          {author}
        </List.Content>
        <List.Content className='time'>
          <Icon color='teal' name='clock' size='large' />
          <Timestamp time={timestamp / 1000} format='full' />
        </List.Content>
        <List.Content className='post-body'>{body}</List.Content>
        <List.Content className='votes'>
          <Icon
            name='thumbs up outline'
            color='teal'
            size='large'
            onClick={() => onUpvote(id)}
          />
          <div className='vote-score'>
            <p className='vote-score-num'>{voteScore}</p>
          </div>
          <Icon
            name='thumbs down outline'
            color='red'
            size='large'
            onClick={() => onDownvote(id)}
          />
        </List.Content>
        <List.Content className='comments'>
          <Icon name='comment outline' color='teal' size='large' />
          {commentsCount}
        </List.Content>
        <div className='post-btn-wrapper'>
          <Responsive
            as={Button}
            onClick={() => onDelete(id)}
            compact
            basic
            color='red'
            size='tiny'
            floated='right'
            maxWidth={680}
            className='postdetail-deletepost-btn'
          >
            <Icon name='trash' />
            Delete
          </Responsive>
          <Responsive
            as={Button}
            onClick={() => onDelete(id)}
            compact
            basic
            color='red'
            size='tiny'
            floated='right'
            minWidth={681}
          >
            <Icon name='trash' />
            Delete post
          </Responsive>

          <Link to={`/editpost/${id}`}>
            <Responsive
              as={Button}
              compact
              basic
              color='teal'
              size='tiny'
              floated='left'
              maxWidth={680}
              className='postdetail-editpost-btn'
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
              minWidth={681}
            >
              <Icon name='edit' />
              Edit post
            </Responsive>
          </Link>
        </div>
      </Segment>
    </div>
  );
};

export default SinglePost;
