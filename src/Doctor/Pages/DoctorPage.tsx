// src/Doctor/Pages/DoctorPage.tsx
// Main Doctor Clinical Workspace Page
import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from '../../Common/Components/Sidebar';
import { Topbar } from '../../Common/Components/Topbar';
import { ErrorBoundary } from '../../Common/Components/ErrorBoundary';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { Patient, TherapyPackage } from '../types/doctor.types';

// Tab Pages
import { DoctorDashboard } from './DoctorDashboard';
import { MyPatients } from './MyPatients';
import { PrakritiAssessmentPage } from './PrakritiAssessmentPage';
import { TherapyPackagesPage } from './TherapyPackagesPage';
import { TherapyPlanBuilderPage } from './TherapyPlanBuilderPage';
import { AIDietExerciseReviewPage } from './AIDietExerciseReviewPage';
import { ProgressAnalyticsPage } from './ProgressAnalyticsPage';
import { ReportsPage } from './ReportsPage';

import {
  LayoutDashboard,
  Users,
  Sparkles,
  FileSpreadsheet,
  Calendar,
  Apple,
  Activity,
  FileText,
  Stethoscope,
} from 'lucide-react';

const doctorNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'My Patients', icon: Users },
  { id: 'prakriti', label: 'Prakriti Assessment', icon: Sparkles },
  { id: 'plan-builder', label: 'Therapy Protocols & Plans', icon: Calendar },
  { id: 'ai-diet', label: 'AI Diet & Yoga', icon: Apple },
  { id: 'analytics', label: 'Progress & Analytics', icon: Activity },
  { id: 'reports', label: 'Clinical Reports', icon: FileText },
];

export const DoctorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<'clinic' | 'solo'>('clinic');

  const { data: patients = [] } = useGetPatientsQuery();
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [activePackage, setActivePackage] = useState<TherapyPackage | null>(null);

  // Auto-initialize active patient from central store
  useEffect(() => {
    if (!activePatient && patients.length > 0) {
      setActivePatient(patients[0]);
    }
  }, [patients, activePatient]);

  // Workflow Navigation Handlers
  const handleSelectPatientForPrakriti = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('prakriti');
  };

  const handleSelectPatientForPlan = (patient: Patient) => {
    setActivePatient(patient);
    setActivePackage(null);
    setActiveTab('plan-builder');
  };

  const handleSelectPackageForPlan = (pkg: TherapyPackage) => {
    setActivePackage(pkg);
    setActiveTab('plan-builder');
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f5] font-sans antialiased text-gray-800">
      {/* Role-Aware Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        roleTitle="Doctor Portal"
        adminName="Dr. Vaidya Shrikant"
        adminEmail="dr.shrikant@ayursutra.com"
        navItems={doctorNavItems}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          clinicName="AyurSutra Wellness & Panchakarma Clinic"
          certificationLabel="AYUSH Certified"
          adminName="Dr. Vaidya Shrikant, BAMS MD"
          adminRole={`Senior Ayurvedic Physician (${mode === 'clinic' ? 'Clinic Mode' : 'Solo Mode'})`}
          adminEmail="dr.shrikant@ayursutra.com"
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
        />

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <ErrorBoundary>
              {activeTab === 'dashboard' && (
                <DoctorDashboard onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'patients' && (
                <MyPatients
                  onSelectPatientForPrakriti={handleSelectPatientForPrakriti}
                  onSelectPatientForPlan={handleSelectPatientForPlan}
                  onSelectPatientForAnalytics={(patient: Patient) => {
                    setActivePatient(patient);
                    setActiveTab('analytics');
                  }}
                  onSelectPatientForReports={(patient: Patient) => {
                    setActivePatient(patient);
                    setActiveTab('reports');
                  }}
                />
              )}

              {activeTab === 'prakriti' && (
                <PrakritiAssessmentPage
                  patient={activePatient || undefined}
                  onSelectPatient={(p: Patient) => setActivePatient(p)}
                  onProceedToPlan={() => setActiveTab('plan-builder')}
                  onReturnToPatients={() => setActiveTab('patients')}
                />
              )}

              {(activeTab === 'protocols' || activeTab === 'plan-builder') && (
                <TherapyPlanBuilderPage
                  patient={activePatient || undefined}
                  initialPackage={activePackage || undefined}
                  initialStep={activePackage ? 'builder' : 'packages'}
                  mode={mode}
                  onSelectPatient={(p: Patient) => setActivePatient(p)}
                  onPlanCreated={() => setActiveTab('ai-diet')}
                  onBack={() => setActiveTab('patients')}
                />
              )}

              {activeTab === 'ai-diet' && (
                <AIDietExerciseReviewPage
                  patient={activePatient || undefined}
                  assignedPackageName={activePackage?.name}
                  onSelectPatient={(p: Patient) => setActivePatient(p)}
                  onPlanApproved={() => setActiveTab('patients')}
                  onBack={() => setActiveTab('plan-builder')}
                />
              )}

              {activeTab === 'analytics' && (
                <ProgressAnalyticsPage
                  initialPatientId={activePatient?.id}
                  onSelectPatient={(p: Patient) => setActivePatient(p)}
                  onModifyPlan={(patientId: string) => {
                    const pat = patients.find((p) => p.id === patientId);
                    if (pat) setActivePatient(pat);
                    setActiveTab('plan-builder');
                  }}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsPage
                  patient={activePatient || undefined}
                  onSelectPatient={(p: Patient) => setActivePatient(p)}
                  onBack={() => setActiveTab('patients')}
                />
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorPage;
