import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { fetchAddPost } from '../../redux/actions';
import MobileSidebar from '../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';
import BackButton from '@/components/ui/back-button';
import FormCategorySelect from '../forms/form-category-select';
import FormTitleInput from '../forms/form-title-input';
import FormAuthorInput from '../forms/form-author-input';
import FormContentTextarea from '../forms/form-content-textarea';
import { FilePlus, PlusCircle } from 'lucide-react';
import { animateCards } from '../animations/card-animations';
import { useGsapContext } from '../animations/use-gsap-animation';

const formSchema = z.object({
  category: z.string().min(1, {
    message: 'Please select a category.',
  }),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  author: z.string().min(2, {
    message: 'Author name must be at least 2 characters.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PostData {
  id: string;
  timestamp: number;
  title: string;
  body: string;
  author: string;
  category: string;
  deleted: boolean;
  voteScore: number;
}

const AddPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(containerRef as React.RefObject<HTMLDivElement | null>, () => {
    animateCards('.add-post-form-card', animationsEnabled, 0.2, 0.3);
  }, [animationsEnabled]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'react',
      title: '',
      author: '',
      content: '',
    },
  });

  function onSubmit(values: FormValues) {
    const data: PostData = {
      id: uuidv1(),
      timestamp: Date.now(),
      title: values.title,
      body: values.content,
      author: values.author,
      category: values.category,
      deleted: false,
      voteScore: 1,
    };
    (fetchAddPost(data))(dispatch);
    navigate('/posts');
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
          <h1 className='text-3xl font-bold text-center text-teal-500 dark:text-teal-400 mb-6 flex items-center justify-center'>
            <FilePlus className='inline-block mr-2 h-8 w-8' />
            {t('addPost.new-post')}
          </h1>
        </div>
        <div ref={containerRef}>
          <div className='add-post-form-card max-w-2xl mx-auto bg-card dark:bg-gray-800 p-8 rounded-lg shadow-inner border-t-4 border-teal-500 dark:border-gray-700'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormCategorySelect
                control={form.control}
                name='category'
                labelKey='addPost.form-label.category'
                placeholderKey='addPost.category'
              />
              <FormTitleInput
                control={form.control}
                name='title'
                labelKey='addPost.form-label.title'
                placeholderKey='addPost.placeholder.enter-title'
              />
              <FormAuthorInput
                control={form.control}
                name='author'
                labelKey='addPost.form-label.author'
                placeholderKey='addPost.placeholder.enter-author'
              />
              <FormContentTextarea
                control={form.control}
                name='content'
                labelKey='addPost.form-label.content'
                placeholderKey='addPost.placeholder.enter-content'
              />
              <Button type='submit' className='w-32'>
                <PlusCircle className='mr-2 h-4 w-4' />
                {t('addPost.add-post')}
              </Button>
            </form>
          </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;