import React, { forwardRef, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { useGsapContext } from '../animations/use-gsap-animation';
import { animateCategoryText } from '../animations/text-animations';

interface CategoryCardProps {
  categoryName: string;
}

const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ categoryName }, ref) => {
    const { t } = useTranslation();
    const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);
    const cardRef = useRef<HTMLDivElement>(null);

    const formattedCategoryName = categoryName
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      : '';

  useGsapContext(
    cardRef as React.RefObject<HTMLDivElement | null>,
    () => {
      const container = cardRef.current;
      if (container) {
        animateCategoryText(container, '[data-category-text]', animationsEnabled, 0.5);
      }
    },
    [animationsEnabled, formattedCategoryName]
  );

    return (
      <div ref={ref} className='flex justify-center'>
        <Card key={formattedCategoryName} ref={cardRef} className='formatted-category-card w-auto dark:bg-gray-800 dark:border-gray-700'>
          <CardContent className='p-4 bg-teal-100 dark:bg-teal-900/50'>
            <p data-category-text className='text-lg font-semibold text-primary dark:text-white'>
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
