import React from 'react';
import { Link } from 'react-router-dom';
import Timestamp from 'react-timestamp';
import { Segment, List, Icon, Button, Responsive } from 'semantic-ui-react';

const SingleComment = ({
  comment,
  onUpvote,
  onDownvote,
  onDelete,
  timestamp,
}) => {
  const { id, author, body, voteScore } = comment;

  return (
    <div className='comment-wrapper'>
      <Segment color='teal' raised className='comments-segment'>
        <List.Content className='author'>
          <Icon name='user' color='teal' size='large' />
          {author}
        </List.Content>
        <List.Content className='time'>
          <Icon color='teal' name='clock' size='large' />
          <Timestamp
            date={comment.timestamp ? comment.timestamp / 1000 : undefined}
            options={{ twentyFourHour: true }}
          />
        </List.Content>
        <List.Content className='comment-body'>{body}</List.Content>
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
        <div className='comment-btn-wrapper'>
          <Responsive
            as={Button}
            compact
            basic
            color='red'
            size='tiny'
            floated='right'
            onClick={() => onDelete(id)}
            maxWidth={680}
            className='postdetail-deletecomment-btn'
          >
            <Icon name='trash' />
            Delete
          </Responsive>
          <Responsive
            as={Button}
            compact
            basic
            color='red'
            size='tiny'
            floated='right'
            onClick={() => onDelete(id)}
            minWidth={681}
          >
            <Icon name='trash' />
            Delete comment
          </Responsive>

          <Link to={`/editcomment/${id}`}>
            <Responsive
              as={Button}
              compact
              basic
              color='teal'
              size='tiny'
              floated='left'
              maxWidth={680}
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
              Edit comment
            </Responsive>
          </Link>
        </div>
      </Segment>
    </div>
  );
};

export default SingleComment;
