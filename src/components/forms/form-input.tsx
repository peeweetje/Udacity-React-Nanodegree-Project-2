import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  id: string;
  name: string;
  labelKey: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ id, name, labelKey, value, onChange }: FormInputProps) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{t(labelKey)}</Label>
      <Input
        className='border-teal-200'
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        aria-required='true'
      />
    </div>
  );
}

export default FormInput;