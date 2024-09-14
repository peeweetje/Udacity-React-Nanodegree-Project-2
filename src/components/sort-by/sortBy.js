import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeSortAction } from '../../redux/actions';
import { Select } from 'semantic-ui-react';
import { valueOptions } from '../../utils/options';

const SortBy = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleChange = (e, data) => {
    setValue(data.value);
    dispatch(changeSortAction({ value: data.value }));
  };

  return (
    <div className='sort'>
      <Select
        onChange={handleChange}
        color='teal'
        name='sort'
        placeholder='Sort By'
        options={valueOptions}
        value={value}
      />
    </div>
  );
};

export default SortBy;
