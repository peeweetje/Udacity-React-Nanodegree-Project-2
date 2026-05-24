import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

interface ProfileAvatarProps {
  userName: string;
}

const ProfileAvatar = ({ userName }: ProfileAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const userHandle = `@${userName.toLowerCase().replace(/\s+/g, '')}`;
  const animationsEnabled = useSelector((state: any) => state.animations?.enabled ?? true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!animationsEnabled) {
        gsap.set('.profile-avatar-icon', { scale: 1, opacity: 1, rotation: 0 });
        gsap.set('.profile-avatar-name', { y: 0, opacity: 1 });
        gsap.set('.profile-avatar-handle', { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        '.profile-avatar-icon',
        { scale: 0, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
      gsap.fromTo(
        '.profile-avatar-name',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.profile-avatar-handle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.35 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationsEnabled]);

  return (
    <div ref={containerRef} className='flex flex-col items-center mb-8'>
      <div className='profile-avatar-icon w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4'>
        <User className='h-12 w-12 text-teal-600' />
      </div>
      <h2 className='profile-avatar-name text-2xl font-bold text-gray-900 dark:text-white'>
        {userName}
      </h2>
      <p className='profile-avatar-handle text-sm text-gray-500 dark:text-gray-400 mt-1'>
        {userHandle}
      </p>
    </div>
  );
};

export default ProfileAvatar;