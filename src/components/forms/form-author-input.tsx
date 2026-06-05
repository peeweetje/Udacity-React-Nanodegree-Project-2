import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormAuthorInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  labelKey: string;
  placeholderKey: string;
}

const FormAuthorInput = <T extends FieldValues>({ control, name, labelKey, placeholderKey }: FormAuthorInputProps<T>) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(labelKey)}</FormLabel>
          <FormControl>
            <Input
              className='border-teal-200'
              placeholder={t(placeholderKey)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormAuthorInput;