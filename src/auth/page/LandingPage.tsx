import React, { useState } from 'react';
import { useLoginMutation } from '../apis/Authapi';
import { UserRole } from '../types/login';
import { useNavigate } from 'react-router-dom';
import ayursutraLogo from '../../assets/ayursutra_logo.png';
import heroImg from '../../assets/ayursutra-landing-hero.png';

// Portal Card component
const PortalCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  buttonText 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  onClick: () => void;
  buttonText: string;
}) => (
  <div 
    onClick={onClick}
    className="group cursor-pointer bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-800 transition-all duration-300 flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 rounded-full bg-[#fbf9f6] text-emerald-900 flex items-center justify-center mb-6 group-hover:bg-emerald-900 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{description}</p>
    
    <button 
      className="mt-auto px-6 py-2.5 border border-emerald-900 text-emerald-900 rounded-full group-hover:bg-emerald-900 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
    >
      {buttonText}
    </button>
  </div>
);

export const LandingPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // Overlay state
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeLoginType, setActiveLoginType] = useState<'solo' | 'patient' | null>(null);

  // Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

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

  const handleSoloOrPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLoginType === 'solo') {
      navigate('/solo-practitioner-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
    setLoginModalOpen(false);
    setActiveLoginType(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] font-sans text-slate-800">
      
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-xs border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src={ayursutraLogo} alt="AyurSutra Logo" className="w-9 h-9 object-contain" />
          <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">AyurSutra</span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-650 font-bold text-xs uppercase tracking-wider">
          <a href="#" className="hover:text-emerald-900 transition">Home</a>
          <a href="#" className="hover:text-emerald-900 transition">Services</a>
          <a href="#" className="hover:text-emerald-900 transition">About Us</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-amber-800 font-extrabold tracking-widest text-xs uppercase mb-4 block">Holistic Wellness Platform</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-950 leading-tight mb-6">
            Traditional Wisdom. <br/>
            <span className="text-emerald-900">Modern Precision.</span>
          </h1>
          <p className="text-base text-slate-600 mb-8 max-w-lg leading-relaxed font-semibold">
            Automating the lifecycle of Panchakarma treatments. Experience zero-conflict scheduling, AI-powered diet plans, and real-time patient tracking.
          </p>
        </div>
        
        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden shadow-xl h-80 bg-gray-200 border border-slate-200">
           <img 
             src={heroImg} 
             alt="AyurSutra Dashboard" 
             className="w-full h-full object-cover"
           />
        </div>
      </div>

      {/* Role Selection / Login Section */}
      <div className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-emerald-950 mb-4 tracking-tight">Select Your Portal</h2>
            <p className="text-slate-500 font-semibold text-sm">Access your dedicated workspace to manage clinic operations and patient care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PortalCard 
              title="Organization (Clinic)" 
              description="Deploy AyurSutra across your clinic. Sub-role access for Admin, Doctor, and Therapist."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              }
              buttonText="Open Clinic Portal"
              onClick={() => setOrgModalOpen(true)}
            />
            
            <PortalCard 
              title="Solo Practitioner" 
              description="Digitize your solo Ayurvedic practice. Custom schedule and enema tracking tools."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              }
              buttonText="Login Solo Practice"
              onClick={() => {
                setActiveLoginType('solo');
                setLoginModalOpen(true);
              }}
            />

            <PortalCard 
              title="Patient Portal" 
              description="Track your prescribed diet, log symptoms, and view upcoming procedure schedules."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              }
              buttonText="Open Patient Portal"
              onClick={() => {
                setActiveLoginType('patient');
                setLoginModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Organization Sub-role Selection Modal */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 backdrop-blur-xs px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-emerald-950">Organization Workspace Login</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Please select your clinical staff role.</p>
              </div>
              <button 
                onClick={() => setOrgModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                title="Close select role modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Admin Button */}
              <button
                disabled={isLoading}
                onClick={() => handleRoleLogin('admin')}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-800 hover:bg-slate-50/50 text-left transition"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Clinic Administrator</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Manage schedules, chambers, and practitioners.</p>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                  {isLoading && selectedRole === 'admin' ? 'Authenticating...' : 'Enter'}
                </span>
              </button>

              {/* Doctor Button */}
              <button
                disabled={isLoading}
                onClick={() => handleRoleLogin('doctor')}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-800 hover:bg-slate-50/50 text-left transition"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Clinical Doctor</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Diagnose Prakriti and prescribe diet configurations.</p>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                  {isLoading && selectedRole === 'doctor' ? 'Authenticating...' : 'Enter'}
                </span>
              </button>

              {/* Therapist Button */}
              <button
                disabled={isLoading}
                onClick={() => handleRoleLogin('therapist')}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-800 hover:bg-slate-50/50 text-left transition"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Clinical Therapist</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Execute daily detox/enema sessions and log vitals.</p>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                  {isLoading && selectedRole === 'therapist' ? 'Authenticating...' : 'Enter'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solo Practitioner & Patient Mock Login Modal */}
      {loginModalOpen && activeLoginType && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 backdrop-blur-xs px-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-emerald-950">
                  {activeLoginType === 'solo' ? 'Solo Practitioner Sign In' : 'Patient Health Portal'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Enter credentials to access your secure portal.</p>
              </div>
              <button 
                onClick={() => {
                  setLoginModalOpen(false);
                  setActiveLoginType(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                title="Close login modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSoloOrPatientSubmit} className="flex flex-col gap-4 text-xs font-bold">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-550">
                  {activeLoginType === 'solo' ? 'Registered Email Address' : 'Registered Mobile Number'}
                </label>
                <input 
                  type={activeLoginType === 'solo' ? 'email' : 'tel'} 
                  required
                  placeholder={activeLoginType === 'solo' ? 'e.g. solo@ayursutra.com' : 'e.g. 9876543210'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-555">Account Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-800"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-emerald-900 py-3 text-xs font-bold text-white hover:bg-emerald-950 transition uppercase tracking-wider"
              >
                Authenticate Portal
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};