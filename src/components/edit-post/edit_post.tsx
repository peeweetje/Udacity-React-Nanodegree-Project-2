import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditPost, fetchSinglePost } from '../../redux/actions';
import SideBar from '../sidebar/sideBar';
import { options } from '../../utils/options';
import Loading from '../loading/loading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface RootState {
  posts: {
    posts: Post[];
  };
}

interface Post {
  id: string;
  category: string;
  title: string;
  author: string;
  body: string;
}

interface FormValues {
  postCategory: string;
  postTitle: string;
  postAuthor: string;
  postContent: string;
}

const formSchema = z.object({
  postCategory: z.string().min(1, 'Category is required'),
  postTitle: z.string().min(1, 'Post title is required'),
  postAuthor: z.string().min(1, 'Author is required'),
  postContent: z.string().min(1, 'Content is required'),
});

const EditPost: React.FC = () => {
  const dispatch = useDispatch();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === postId)
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postCategory: '',
      postTitle: '',
      postAuthor: '',
      postContent: '',
    },
  });

  useEffect(() => {
    const loadPost = async () => {
      if (postId) {
        setIsLoading(true);
        await dispatch(fetchSinglePost(postId));
        setIsLoading(false);
      }
    };
    loadPost();
  }, [dispatch, postId]);

  useEffect(() => {
    if (post && !isLoading) {
      form.reset({
        postCategory: post.category,
        postTitle: post.title,
        postAuthor: post.author,
        postContent: post.body,
      });
    }
  }, [post, isLoading, form]);

  const onSubmit = async (values: FormValues) => {
    const data = {
      id: postId,
      title: values.postTitle,
      body: values.postContent,
      author: values.postAuthor,
      category: values.postCategory,
    };
    await dispatch(fetchEditPost(data, postId));
    navigate('/');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-neutral-10'>
      <SideBar />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <h1 className=' text-teal-500 text-3xl font-bold text-primary'>
            <Edit className=' text-teal-500 inline-block mr-2' />
            Edit Post
          </h1>
        </div>
        <div className='max-w-2xl mx-auto bg-card bg-neutral-100 p-8 rounded-lg shadow-inner'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='postCategory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder='Post Title'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postAuthor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder='Author'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postContent'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Post Content'
                        className='resize-none border-teal-200'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-32'>
                <Edit className='mr-2 h-4 w-4' /> Edit Post
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
