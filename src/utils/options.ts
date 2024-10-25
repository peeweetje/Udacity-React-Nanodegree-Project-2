import { TFunction } from 'i18next';

interface Option {
  key: number;
  text: string;
  value: string;
}

export interface ValueOption {
  value: string;
  text: string;
}

export const options: Option[] = [
  { key: 1, text: 'React', value: 'react' },
  { key: 2, text: 'Redux', value: 'redux' },
  { key: 3, text: 'Udacity', value: 'udacity' },
  { key: 4, text: 'Javascript', value: 'javascript' },
];

export const createValueOptions = (t: TFunction): ValueOptions[] => [
  { value: 'popular', text: t('common.popular') },
  { value: 'unpopular', text: t('common.unpopular') },
  { value: 'oldest', text: t('common.old') },
  { value: 'newest', text: t('common.new') },
];
