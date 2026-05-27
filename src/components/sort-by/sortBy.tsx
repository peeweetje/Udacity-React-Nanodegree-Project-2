import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { changeSortAction } from '../../redux/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { createValueOptions, ValueOption } from '../../utils/options';

interface RootState {
  sort: {
    value: string;
  };
}



const SortBy = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.sort.value);
  const valueOptions = createValueOptions(t);
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!animationsEnabled) {
      gsap.set(el, { y: 0, opacity: 1 });
      return;
    }
    gsap.set(el, { y: -20, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, [animationsEnabled]);

  const handleChange = (newValue: string) => {
    dispatch(changeSortAction({ value: newValue }));
  };

  return (
    <div ref={containerRef} className='sort-by-container w-[100px]'>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('common.sort-by')} />
        </SelectTrigger>
        <SelectContent>
          {valueOptions.map((option: ValueOption) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortBy;
