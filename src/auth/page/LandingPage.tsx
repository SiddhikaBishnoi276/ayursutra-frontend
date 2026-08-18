import React, { useState } from 'react';
import { useLoginMutation } from '../apis/Authapi';
import { UserRole } from '../types/login';
import { useNavigate } from 'react-router-dom';
import ayursutraLogo from '../../assets/ayursutra_logo.png';
import heroImg from '../../assets/ayursutra-landing-hero.png';

// In a real app, this would be imported from a separate file: src/features/auth/components/RoleCard.tsx
const RoleCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  isLoading 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  onClick: () => void;
  isLoading: boolean;
}) => (
  <div 
    onClick={onClick}
    className="group cursor-pointer bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-ayur-green-light transition-all duration-300 flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 rounded-full bg-[#f4f7f4] text-ayur-primary flex items-center justify-center mb-6 group-hover:bg-ayur-primary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{description}</p>
    
    <button 
      disabled={isLoading}
      className="mt-auto px-6 py-2 border border-ayur-primary text-ayur-primary rounded-full group-hover:bg-ayur-primary group-hover:text-white font-medium transition-all"
    >
      {isLoading ? 'Authenticating...' : `Login as ${title}`}
    </button>
  </div>
);

export const LandingPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

 const handleRoleLogin = async (role: UserRole) => {
    setSelectedRole(role);
    try {
      await login({ role, email: 'demo@ayursutra.com' }).unwrap();
      
      // Route user based on role
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'doctor') navigate('/doctor-dashboard');
      else if (role === 'therapist') navigate('/therapist-dashboard');
      
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={ayursutraLogo} alt="AyurSutra Logo" className="w-9 h-9 object-contain" />
          <span className="text-2xl font-bold text-ayur-primary tracking-wide">AyurSutra</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-ayur-primary">Home</a>
          <a href="#" className="hover:text-ayur-primary">Services</a>
          <a href="#" className="hover:text-ayur-primary">About Us</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-ayur-brown font-bold tracking-widest text-sm uppercase mb-4 block">Holistic Wellness Platform</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Traditional Wisdom. <br/>
            <span className="text-ayur-primary">Modern Precision.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Automating the lifecycle of Panchakarma treatments. Experience zero-conflict scheduling, AI-powered diet plans, and real-time patient tracking.
          </p>
        </div>
        
        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl h-80 bg-gray-200">
           <img 
             src={heroImg} 
             alt="AyurSutra Dashboard" 
             className="w-full h-full object-cover"
           />
        </div>
      </div>

      {/* Role Selection / Login Section */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Portal</h2>
            <p className="text-gray-500">Access your dedicated dashboard to manage clinic operations and patient care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard 
              title="Admin" 
              description="Manage staff, inventory, therapy templates, and clinic-wide analytics."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              }
              isLoading={isLoading && selectedRole === 'admin'}
              onClick={() => handleRoleLogin('admin')}
            />
            
            <RoleCard 
              title="Doctor" 
              description="Review Prakriti, generate AI diet plans, and track real-time patient progress."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              isLoading={isLoading && selectedRole === 'doctor'}
              onClick={() => handleRoleLogin('doctor')}
            />

            <RoleCard 
              title="Therapist" 
              description="Execute daily sessions, track materials, and log procedure observations."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              }
              isLoading={isLoading && selectedRole === 'therapist'}
              onClick={() => handleRoleLogin('therapist')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};