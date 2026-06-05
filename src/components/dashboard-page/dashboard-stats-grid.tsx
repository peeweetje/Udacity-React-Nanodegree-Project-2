import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Hash, TrendingUp, Eye } from 'lucide-react';
import DashboardStatCard from './dashboard-stat-card';

interface DashboardStatsGridProps {
  activePostsCount: number;
  totalComments: number;
  categoriesCount: number;
  totalVotes: number;
}

const DashboardStatsGrid = ({ activePostsCount, totalComments, categoriesCount, totalVotes }: DashboardStatsGridProps) => {
  const { t } = useTranslation();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <DashboardStatCard
        icon={MessageSquare}
        label={t('dashboard.active-topics')}
        value={activePostsCount}
        trend={activePostsCount > 0 ? t('dashboard.total-topics', { count: activePostsCount }) : t('dashboard.total-topics', { count: 0 })}
        trendDirection='up'
      />
      <DashboardStatCard
        icon={Hash}
        label={t('dashboard.new-comments')}
        value={totalComments}
        trend={totalComments > 0 ? t('dashboard.total-comments', { count: totalComments }) : t('dashboard.total-comments', { count: 0 })}
        trendDirection='up'
      />
      <DashboardStatCard
        icon={TrendingUp}
        label={t('dashboard.trending-categories')}
        value={categoriesCount}
        trend={categoriesCount > 0 ? t('dashboard.total-categories', { count: categoriesCount }) : t('dashboard.total-categories', { count: 0 })}
        trendDirection='up'
      />
      <DashboardStatCard
        icon={Eye}
        label={t('dashboard.total-votes')}
        value={totalVotes}
        trend={totalVotes > 0 ? t('dashboard.total-votes-trend', { count: totalVotes }) : t('dashboard.total-votes-trend', { count: 0 })}
        trendDirection='up'
      />
    </div>
  );
}

export default DashboardStatsGrid;