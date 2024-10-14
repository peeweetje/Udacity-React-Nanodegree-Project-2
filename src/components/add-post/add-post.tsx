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
import { t } from 'i18next';

const formSchema = z.object({
  category: z.string().min(1, {
    message: t('add-post.category'),
  }),
  title: z.string().min(2, {
    message: t('add-post.title'),
  }),
  author: z.string().min(2, {
    message: t('add-post.author'),
  }),
  content: z.string().min(10, {
    message: t('add-post.content'),
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
            {t('add-post.newPost')}
          </h1>
        </div>
        <div className='max-w-2xl mx-auto bg-card bg-neutral-100 p-8 rounded-lg shadow-inner'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name={t('add-post.formfield.category')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('add-post.category')} />
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
                name={t('add-post.formfield.title')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('add-post.placeholder.enterTitle')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={t('add-post.formfield.author')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        className='border-teal-200'
                        placeholder={t('add-post.placeholder.enterAuthor')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={t('add-post.formfield.content')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('add-post.placeholder.enterContent')}
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
                {t('add-post.addPost')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
