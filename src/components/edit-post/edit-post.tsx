import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditPost, fetchSinglePost } from '../../redux/actions';
import MobileSidebar from '../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar';
import Loading from '../loading/loading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Edit } from 'lucide-react';
import BackButton from '@/components/ui/back-button';
import HamburgerButton from '@/components/ui/hamburger-button';
import FormCategorySelect from '../forms/form-category-select';
import FormTitleInput from '../forms/form-title-input';
import FormAuthorInput from '../forms/form-author-input';
import FormContentTextarea from '../forms/form-content-textarea';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';
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

const EditPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useGsapContext(containerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.edit-post-card', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled, isLoading]);

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
    navigate(`/${values.postCategory}/${postId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen bg-neutral-10 dark:bg-gray-900'>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

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
        <div ref={containerRef}>
          <div className='edit-post-card max-w-2xl mx-auto bg-card bg-neutral-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner dark:border dark:border-gray-700'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormCategorySelect
                  control={form.control}
                  name='postCategory'
                  labelKey='editPost.category'
                  placeholderKey='editPost.placeholder-category'
                />
                <FormTitleInput
                  control={form.control}
                  name='postTitle'
                  labelKey='editPost.label-title'
                  placeholderKey='editPost.label-title'
                />
                <FormAuthorInput
                  control={form.control}
                  name='postAuthor'
                  labelKey='editPost.label-author'
                  placeholderKey='editPost.label-author'
                />
                <FormContentTextarea
                  control={form.control}
                  name='postContent'
                  labelKey='editPost.label-content'
                  placeholderKey='editPost.placeholder-text-area'
                />
                <Button type='submit' className='w-32'>
                  <Edit className='mr-2 h-4 w-4' /> {t('editPost.button-edit')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;