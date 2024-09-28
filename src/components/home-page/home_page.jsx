import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import * as actions from '../../redux/actions'
import { sortPosts } from '../../utils/sortPosts'
import  Loading  from '../loading/loading'	

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Edit, PlusCircle, User, Clock } from 'lucide-react'

import Menu from '../menu/menu'
import SideBar from '../sidebar/sideBar'

const HomePage=()=> {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)
  const sort = useSelector((state) => state.sort.sort)
  const postsLoading = useSelector((state) => state.posts.loading)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.fetchPosts())
      const timer = setTimeout(() => {
        setLoading(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
    fetchData()
  }, [dispatch])




  const deletePost = (postId) => {
    dispatch(actions.fetchDeletePost(postId))
  }

  const iconThumbsUp = (postId) => {
    dispatch(actions.fetchVotePost(postId, 'upVote'))
  }

  const iconThumbsDown = (postId) => {
    dispatch(actions.fetchVotePost(postId, 'downVote'))
  }

  if (loading || postsLoading) {
    return <Loading />
  }

 

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="flex-1 p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Git Talks</h1>
          </div>
          <Menu />
        </div>

        <div className="grid gap-6 mt-8 w-4/5 mx-auto">
          {posts &&
            posts.length > 0 &&
            sortPosts(
              posts.filter((post) => !post.deleted),
              sort.value
            ).map((post) => (
              <Card className="w-full" key={post.id}>
                <CardHeader>
                  <CardTitle>
                    <Link to={`/${post.category}/${post.id}`} className="hover:text-teal-500 transition-colors duration-200">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <Timestamp date={post.timestamp / 1000} options={{ twentyFourHour: true }} />
                    </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button className="w-18" size="sm" onClick={() => iconThumbsUp(post.id)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold">{post.voteScore}</span>
                    <Button className="w-18" variant="destructive" size="sm" onClick={() => iconThumbsDown(post.id)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>{post.comments && post.comments.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/editpost/${post.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Edit post</span>
                      <span className="sm:hidden">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Delete post</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/addpost">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Post
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
