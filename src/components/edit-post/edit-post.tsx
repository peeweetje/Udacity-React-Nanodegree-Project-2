import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditPost, fetchSinglePost } from '../../redux/actions';
import MobileSidebar from '../dashboard-page/mobile-sidebar';
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
import BackButton from '@/components/ui/back-button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        await (fetchSinglePost(postId))(dispatch);
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
    if (!postId) return;
    const data = {
      id: postId,
      title: values.postTitle,
      body: values.postContent,
      author: values.postAuthor,
      category: values.postCategory,
    };
    await (fetchEditPost(data, postId))(dispatch);
    navigate('/');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-neutral-10 dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='4' x2='20' y1='12' y2='12' />
            <line x1='4' x2='20' y1='6' y2='6' />
            <line x1='4' x2='20' y1='18' y2='18' />
          </svg>
          <span className='sr-only'>{t('common.toggle-menu')}</span>
        </Button>
      </div>

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <div className='mb-4'>
            <BackButton />
          </div>
          <h1 className=' text-teal-500 dark:text-teal-400 text-3xl font-bold text-primary dark:text-white'>
            <Edit className=' text-teal-500 dark:text-teal-400 inline-block mr-2' />
            {t('editPost.edit-post')}
          </h1>
        </div>
        <div className='max-w-2xl mx-auto bg-card bg-neutral-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner dark:border dark:border-gray-700'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='postCategory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editPost.category')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('editPost.placeholder-category')}
                          />
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
                    <FormLabel>{t('editPost.label-title')}</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('editPost.label-title')}
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
                    <FormLabel>{t('editPost.label-author')}</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('editPost.label-author')}
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
                    <FormLabel>{t('editPost.label-content')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('editPost.placeholder-text-area')}
                        className='resize-none border-teal-200'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-32'>
                <Edit className='mr-2 h-4 w-4' /> {t('editPost.button-edit')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;