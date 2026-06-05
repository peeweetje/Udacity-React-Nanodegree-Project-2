import React from 'react';

interface FormattedDateProps {
  timestamp: number;
}

function FormattedDate({ timestamp }: FormattedDateProps) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return <span>{`${day}-${month}-${year}`}</span>;
}

export default FormattedDate;