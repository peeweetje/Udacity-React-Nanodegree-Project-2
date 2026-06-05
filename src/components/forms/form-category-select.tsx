import React from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import { options } from '../../utils/options';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormCategorySelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  labelKey: string;
  placeholderKey: string;
}

const FormCategorySelect = <T extends FieldValues>({ control, name, labelKey, placeholderKey }: FormCategorySelectProps<T>) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(labelKey)}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t(placeholderKey)} />
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
  );
}

export default FormCategorySelect;