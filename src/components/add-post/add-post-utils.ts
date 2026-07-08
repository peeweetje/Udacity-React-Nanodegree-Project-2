import { v1 as uuidv1 } from 'uuid';
import * as z from 'zod';
import { fetchAddPost } from '../../redux/actions';
import type { PostData } from '@/types';

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;

export function createPostData(values: FormValues): PostData {
  return {
    id: uuidv1(),
    timestamp: Date.now(),
    title: values.title,
    body: values.content,
    author: values.author,
    category: values.category,
    deleted: false,
    voteScore: 1,
  };
}

export function submitPost(data: PostData, dispatch: any, navigate: any) {
  (fetchAddPost(data))(dispatch);
  navigate('/posts');
}