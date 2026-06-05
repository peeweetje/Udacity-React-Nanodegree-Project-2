import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormTextareaProps {
  id: string;
  name: string;
  labelKey: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const FormTextarea = ({ id, name, labelKey, value, onChange, rows = 6 }: FormTextareaProps) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{t(labelKey)}</Label>
      <Textarea
        className='border-teal-200'
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required
        aria-required='true'
      />
    </div>
  );
}

export default FormTextarea;