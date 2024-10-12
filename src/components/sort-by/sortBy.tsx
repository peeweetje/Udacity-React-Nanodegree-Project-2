import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSortAction } from '../../redux/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { valueOptions } from '../../utils/options';

interface RootState {
  sort: {
    value: string;
  };
}

interface ValueOption {
  value: string;
  text: string;
}

const SortBy: React.FC = () => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.sort.value);

  const handleChange = (newValue: string) => {
    dispatch(changeSortAction({ value: newValue }));
  };

  return (
    <div className='w-[100px]'>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Sort By' />
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
