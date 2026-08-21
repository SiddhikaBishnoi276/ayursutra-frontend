import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RolePortalSection } from './components/RolePortalSection';
import { FeatureBadges } from './components/FeatureBadges';
import { AboutSection } from './components/AboutSection';
import { FeaturesSection } from './components/FeaturesSection';
import { BenefitsPanchakarmaSection } from './components/BenefitsPanchakarmaSection';
import { PanchakarmaProcessSection } from './components/PanchakarmaProcessSection';
import { ContactUsSection } from './components/ContactUsSection';
import { RoleLoginSection } from './components/RoleLoginSection';
import { RoleLoginForm } from '../../auth/component/RoleLoginForm';
import { FooterSection } from './components/FooterSection';
import { UserRole } from '../../auth/types/login';

/**
 * LandingPage — Global entry page for AyurSutra.
 * Visible to all roles (Admin, Doctor, Therapist, Patient) before authentication.
 *
 * Location: src/common/landing/LandingPage.tsx
 * Exported and re-used via: src/auth/page/LandingPage.tsx
 */
export const LandingPage: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  // Role for the login form modal (null = closed)
  const [loginRole, setLoginRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') {
        setCurrentView('contact');
        window.scrollTo(0, 0);
      } else if (hash === '#login') {
        setCurrentView('login');
        window.scrollTo(0, 0);
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /** Called from RoleLoginSection (navbar login btn → role select → pick role) */
  const handleRoleSelected = (roleId: string) => {
    setLoginRole(roleId as UserRole);
  };

  /** Called from RolePortalSection cards ("Login as Doctor" etc.) */
  const handlePortalRoleLogin = (role: UserRole) => {
    setLoginRole(role);
  };

  const closeLoginForm = () => {
    setLoginRole(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFA]">
      {/* ── 1. Sticky Navigation ── */}
      <Navbar />

      {currentView === 'contact' ? (
        <ContactUsSection />
      ) : currentView === 'login' ? (
        /* Role selection screen — clicking a role opens the form modal */
        <RoleLoginSection onRoleSelect={handleRoleSelected} />
      ) : (
        <>
          {/* ── 2. Hero Section (Title + Image + Stats) ── */}
          <HeroSection />

          {/* ── 3. Role Portal Cards ── */}
          <RolePortalSection onRoleLogin={handlePortalRoleLogin} />

          {/* ── 4. Feature Trust Badges ── */}
          <FeatureBadges />

          {/* ── 5. About / Vision Section ── */}
          <AboutSection />

          {/* ── 6. Features Section ── */}
          <FeaturesSection />

          {/* ── 7. Benefits of Panchakarma ── */}
          <BenefitsPanchakarmaSection />

          {/* ── 8. Panchakarma Process ── */}
          <PanchakarmaProcessSection />
        </>
      )}

      {/* ── 9. Footer (always visible) ── */}
      <FooterSection onRoleLogin={(role) => setLoginRole(role as UserRole)} />

      {/* ── Login Form Modal (rendered on top of any view) ── */}
      {loginRole && (
        <RoleLoginForm role={loginRole} onClose={closeLoginForm} />
      )}
    </div>
  );
};
