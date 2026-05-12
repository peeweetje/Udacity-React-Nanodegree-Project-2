import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface HomePageCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cardRef?: React.RefCallback<HTMLDivElement>;
}

const HomePageCard = ({ icon: Icon, title, description, cardRef }: HomePageCardProps) => {
  return (
    <Card ref={cardRef} className='text-center dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader>
        <Icon className='h-10 w-10 text-teal-500 mx-auto' />
        <CardTitle className='dark:text-white'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground dark:text-gray-400 text-sm'>{description}</p>
      </CardContent>
    </Card>
  );
};

export default HomePageCard;