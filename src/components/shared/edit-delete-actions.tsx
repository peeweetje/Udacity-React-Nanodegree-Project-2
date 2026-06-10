import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditDeleteActionsProps {
  editLink: string;
  onDelete: () => void;
  editLabelFull?: string;
  editLabelShort?: string;
  deleteLabelFull?: string;
  deleteLabelShort?: string;
  showShortLabels?: boolean;
  containerClassName?: string;
}

const EditDeleteActions = ({
  editLink,
  onDelete,
  editLabelFull = 'Edit',
  editLabelShort = 'Edit',
  deleteLabelFull = 'Delete',
  deleteLabelShort = 'Delete',
  showShortLabels = false,
  containerClassName = 'flex space-x-2',
}: EditDeleteActionsProps) => {
  return (
    <div className={containerClassName}>
      <Button className='w-34' size='sm' asChild>
        <Link to={editLink}>
          <Edit className='w-4 h-4 mr-2' />
          <span className={showShortLabels ? '' : 'hidden lg:inline'}>{editLabelShort}</span>
          {!showShortLabels && <span className='lg:hidden'>{editLabelFull}</span>}
        </Link>
      </Button>
      <Button
        className='w-34'
        variant='destructive'
        size='sm'
        onClick={onDelete}
      >
        <Trash2 className='w-4 h-4 mr-2' />
        <span className={showShortLabels ? '' : 'hidden lg:inline'}>{deleteLabelShort}</span>
        {!showShortLabels && <span className='lg:hidden'>{deleteLabelFull}</span>}
      </Button>
    </div>
  );
};

export default EditDeleteActions;