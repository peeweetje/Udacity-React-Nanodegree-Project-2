import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormContentTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  labelKey: string;
  placeholderKey: string;
}

const FormContentTextarea = <T extends FieldValues>({ control, name, labelKey, placeholderKey }: FormContentTextareaProps<T>) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(labelKey)}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={t(placeholderKey)}
              className='resize-none border-teal-200'
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormContentTextarea;