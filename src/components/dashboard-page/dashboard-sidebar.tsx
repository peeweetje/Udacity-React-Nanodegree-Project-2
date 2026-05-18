import React, { useState } from 'react';
import MobileSidebar from './mobile-sidebar';
import DesktopSidebar from './desktop-sidebar';
import HamburgerButton from '@/components/ui/hamburger-button';

const DashboardSidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <HamburgerButton onClick={() => setMobileMenuOpen(true)} />

      {/* Mobile sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} showCategories={false} />

      {/* Desktop sidebar */}
      <DesktopSidebar />
    </>
  );
};

export default DashboardSidebar;
