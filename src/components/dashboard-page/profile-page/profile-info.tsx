import React, { useEffect, useRef } from 'react';
import { Mail, Calendar, FileText, MessageSquare, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

interface ProfileInfoProps {
  userName: string;
  memberSinceDate: string | null;
  postsCount: number;
  commentCount: number;
  totalVotes: number;
}

const ProfileInfo = ({
  userName,
  memberSinceDate,
  postsCount,
  commentCount,
  totalVotes,
}: ProfileInfoProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.profile-info-item',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.5,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className='space-y-4'>
      <div className='profile-info-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <Mail className='h-5 w-5 text-teal-500' />
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {userName.toLowerCase().replace(/\s+/g, '')}@example.com
        </span>
      </div>
      <div className='profile-info-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <Calendar className='h-5 w-5 text-teal-500' />
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {t('dashboard.member-since')}{memberSinceDate ? ` ${memberSinceDate}` : ''}
        </span>
      </div>
      <div className='profile-info-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <FileText className='h-5 w-5 text-teal-500' />
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {postsCount} {t('dashboard.posts-count')}
        </span>
      </div>
      <div className='profile-info-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <MessageSquare className='h-5 w-5 text-teal-500' />
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {commentCount} {t('dashboard.comments-made')}
        </span>
      </div>
      <div className='profile-info-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <ThumbsUp className='h-5 w-5 text-teal-500' />
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {totalVotes} {t('dashboard.votes-received')}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;