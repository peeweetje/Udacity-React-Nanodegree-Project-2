import { addPost } from '../../redux/actions/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { fetchAddPost } from '../../redux/actions';
import SideBar from '../sidebar/sideBar';
import { options } from '../../utils/options';
import { PlusCircle } from 'lucide-react';

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

interface PostData extends FormValues {
  id: string;
  timestamp: number;
  body: string;
  deleted: boolean;
  voteScore: number;
}

const AddPost: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      content: values.content, // Added to satisfy PostData interface
    };
    dispatch(fetchAddPost(data));
    navigate('/');
  }

  return (
    <div className='flex min-h-screen bg-neutral-10'>
      <SideBar />
      <div className='flex-1 p-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-center text-teal-500 mb-6 flex items-center justify-center'>
            <PlusCircle className='inline-block mr-2 h-8 w-8' />
            {t('addPost.new-post')}
          </h1>
        </div>
        <div className='max-w-2xl mx-auto bg-card bg-neutral-100 p-8 rounded-lg shadow-inner'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addPost.form-label.category')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('addPost.category')} />
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
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addPost.form-label.title')}</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('addPost.placeholder.enter-title')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='author'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addPost.form-label.author')}</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('addPost.placeholder.enter-author')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addPost.form-label.content')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('addPost.placeholder.enter-content')}
                        className='resize-none border-teal-200'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-32'>
                <PlusCircle className='mr-2 h-4 w-4' />
                {t('addPost.add-Post')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
