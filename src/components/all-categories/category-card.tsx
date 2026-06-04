import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  categoryName: string;
}

const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ categoryName }, ref) => {
    const { t } = useTranslation();

    const formattedCategoryName = categoryName
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      : '';

    return (
      <div ref={ref} className='flex justify-center'>
        <Card className='formatted-category-card w-auto dark:bg-gray-800 dark:border-gray-700'>
          <CardContent className='p-4 bg-teal-100 dark:bg-teal-900/50'>
            <p className='text-lg font-semibold text-primary dark:text-white'>
              {t('common.category')} : {formattedCategoryName}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
);

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;