import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import FormCategorySelect from '../forms/form-category-select';
import FormTitleInput from '../forms/form-title-input';
import FormAuthorInput from '../forms/form-author-input';
import FormContentTextarea from '../forms/form-content-textarea';

interface EditPostFormProps {
  initialCategory: string;
  initialTitle: string;
  initialAuthor: string;
  initialContent: string;
  onSubmit: (values: FormValues) => void;
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

const EditPostForm = ({
  initialCategory,
  initialTitle,
  initialAuthor,
  initialContent,
  onSubmit,
}: EditPostFormProps) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postCategory: initialCategory,
      postTitle: initialTitle,
      postAuthor: initialAuthor,
      postContent: initialContent,
    },
  });

  useEffect(() => {
    form.reset({
      postCategory: initialCategory,
      postTitle: initialTitle,
      postAuthor: initialAuthor,
      postContent: initialContent,
    });
  }, [initialCategory, initialTitle, initialAuthor, initialContent, form]);

  return (
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
          {t('editPost.button-edit')}
        </Button>
      </form>
    </Form>
  );
};

export default EditPostForm;
export type { FormValues };