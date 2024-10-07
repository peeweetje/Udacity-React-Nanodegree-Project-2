import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchSinglePost,
  fetchComments,
  fetchDeletePost,
  fetchAddComment,
  fetchDeleteComment,
  fetchVoteComment,
  fetchVotePost,
} from '../../redux/actions'
import { v1 as uuidv1 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, PlusCircle, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react"
import Menu from '../menu/menu'
import SideBar from '../sidebar/sideBar'
import SinglePost from './single_post'
import SingleComment from './single_comment'

const PostDetail = () => {
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { post_id } = useParams()

  const posts = useSelector((state) => state.posts.posts)
  const comments = useSelector((state) => state.getComments.comments)
  const sort = useSelector((state) => state.sort.sort)

  useEffect(() => {
    dispatch(fetchSinglePost(post_id)).then(() =>
      dispatch(fetchComments(post_id))
    )
  }, [dispatch, post_id])

  const deletePost = useCallback(
    (postId) => {
      dispatch(fetchDeletePost(postId))
    },
    [dispatch]
  )

  const onDeleteComment = useCallback(
    (commentId) => {
      dispatch(fetchDeleteComment(commentId))
    },
    [dispatch]
  )

  const iconThumbsUp = useCallback(
    (postId) => {
      dispatch(fetchVotePost(postId, 'upVote'))
    },
    [dispatch]
  )

  const iconThumbsDown = useCallback(
    (postId) => {
      dispatch(fetchVotePost(postId, 'downVote'))
    },
    [dispatch]
  )

  const iconThumbsUpComment = useCallback(
    (commentId) => {
      dispatch(fetchVoteComment(commentId, 'upVote'))
    },
    [dispatch]
  )

  const iconThumbsDownComment = useCallback(
    (commentId) => {
      dispatch(fetchVoteComment(commentId, 'downVote'))
    },
    [dispatch]
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'commentAuthor') {
      setCommentAuthor(value)
    } else if (name === 'commentContent') {
      setCommentContent(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: uuidv1(),
      timestamp: Date.now(),
      body: commentContent,
      author: commentAuthor,
      parentId: post_id,
      deleted: false,
      parentDeleted: false,
      voteScore: 1,
    }
    dispatch(fetchAddComment(data))
    setCommentAuthor('')
    setCommentContent('')
  }

  const filteredPosts = posts?.filter(
    (post) => !post.deleted && Object.keys(post).length > 0 && !post.error
  )

  const sortedComments = comments
    ?.filter((comment) => !comment.deleted && !comment.parentDeleted)
    .sort((a, b) => {
      switch (sort.value) {
        case 'unpopular':
          return a.voteScore - b.voteScore
        case 'oldest':
          return a.timestamp - b.timestamp
        case 'newest':
          return b.timestamp - a.timestamp
        default:
          return b.voteScore - a.voteScore
      }
    })

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <SideBar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-8">Git Talks</h1>
          <Menu />
          <div className="w-4/5 mx-auto">
            {filteredPosts?.map((post) => (
              <SinglePost
                key={post.id}
                post={post}
                commentsCount={comments?.length || 0}
                onUpvote={iconThumbsUp}
                onDownvote={iconThumbsDown}
                onDelete={deletePost}
              />
            ))}
  
            <div className="mt-8">
              {sortedComments?.map((comment) => (
                <SingleComment
                  key={comment.id}
                  comment={comment}
                  onUpvote={iconThumbsUpComment}
                  onDownvote={iconThumbsDownComment}
                  onDelete={onDeleteComment}
                />
              ))}
  
              {filteredPosts?.length > 0 ? (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Add a Comment</CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="commentAuthor" className="text-sm font-medium">
                          Author
                        </label>
                        <Input
                          className="border-teal-200"
                          id="commentAuthor"
                          name="commentAuthor"
                          value={commentAuthor}
                          onChange={handleInputChange}
                          placeholder="Author"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="commentContent" className="text-sm font-medium">
                          Comment Content
                        </label>
                        <Textarea
                          className="border-teal-200"
                          id="commentContent"
                          name="commentContent"
                          value={commentContent}
                          onChange={handleInputChange}
                          placeholder="Add a comment"
                          rows={6}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-34" type="submit" size="sm">
                        <PlusCircle className="mr-2 w-4 h-4" />
                        Add Comment
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              ) : (
                <Card className="mt-8">
                  <CardContent className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-4">Post not found.</h3>
                    <Button onClick={() => navigate(-1)} size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    )
}

export default PostDetail