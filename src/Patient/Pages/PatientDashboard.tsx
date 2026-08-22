// src/Patient/Pages/PatientDashboard.tsx
// Screen 1: Overview Dashboard for AyurSutra Patient Portal

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  Utensils,
  Pill,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '../../Common/Components/StatCard';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { EmptyState } from '../../Common/Components/EmptyState';
import { Skeleton } from '../../Common/Components/Skeleton';
import { Card } from '../../Common/Components/Card';

import { useMyTherapyPlan } from '../Hooks/useMyTherapyPlan';
import { useMyAppointments } from '../Hooks/useMyAppointments';
import { useGetMyPrescriptionsQuery, useGetMyProfileQuery } from '../apis/patientApi';
import { UpcomingSessionCard } from '../Components/UpcomingSessionCard';
import { TherapyProgressTracker } from '../Components/TherapyProgressTracker';
import { PrescriptionDrawer } from '../Components/PrescriptionDrawer';
import { DietPlanCard } from '../Components/DietPlanCard';
import { Modal } from '../../Common/Components/Modal';
import { formatDate } from '../Services/patientService';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { plan, stats, isLoading: isPlanLoading } = useMyTherapyPlan();
  const { nextSession, pendingFeedbackSessions, isLoading: isAptLoading } = useMyAppointments();
  const { data: prescriptions, isLoading: isPrescLoading } = useGetMyPrescriptionsQuery();
  const { data: profile } = useGetMyProfileQuery();

  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);

  if (isPlanLoading || isAptLoading || isPrescLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton variant="card" className="h-36" />
          <Skeleton variant="card" className="h-36" />
          <Skeleton variant="card" className="h-36" />
          <Skeleton variant="card" className="h-36" />
        </div>
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  // Edge Case 1: No active therapy plan assigned
  if (!plan) {
    return (
      <div className="py-12">
        <EmptyState
          title="No Active Therapy Plan"
          message="No active treatment plan found for your profile. Please consult your supervising Ayurvedic doctor to initiate your Panchakarma regimen."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/profile')}>
              View Doctor Details
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="ayur" size="sm">
              {profile?.prakritiType || 'Vata-Kapha'} Constitution
            </Badge>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">
              ID: {profile?.id || localStorage.getItem('userId') || 'Patient'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif tracking-tight">
            Namaste, {profile?.name || localStorage.getItem('name') || 'Patient'}
          </h1>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Active Package: <strong className="text-gray-800">{plan.packageName}</strong> (Supervised by {plan.doctorName})
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDietModalOpen(true)}
            icon={<Utensils className="w-3.5 h-3.5 text-purple-700" />}
          >
            My Diet Plan
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPrescriptionOpen(true)}
            icon={<Pill className="w-3.5 h-3.5 text-purple-700" />}
          >
            Prescriptions
          </Button>
        </div>
      </div>

      {/* 2. Top StatCards (4 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sessions Completed */}
        <StatCard
          label="Sessions Completed"
          value={`${stats.completed} / ${stats.total}`}
          context="Therapeutic stages completed"
          trend={{
            text: 'On Track',
            variant: 'success',
            icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
          }}
          onClick={() => navigate('/patient/therapy-plan')}
        />

        {/* Card 2: Sessions Remaining */}
        <StatCard
          label="Sessions Remaining"
          value={`${stats.remaining} Sessions`}
          context={`Target Completion: ${formatDate(plan.endDate)}`}
          trend={{
            text: 'Active Plan',
            variant: 'ayur',
            icon: <Clock className="w-3 h-3 text-ayur-brown" />,
          }}
          onClick={() => navigate('/patient/therapy-plan')}
        />

        {/* Card 3: Next Appointment */}
        <StatCard
          label="Next Appointment"
          value={nextSession ? nextSession.time : 'None Scheduled'}
          context={nextSession ? `${nextSession.roomNumber} • ${nextSession.therapistName}` : 'All sessions completed'}
          trend={{
            text: nextSession ? formatDate(nextSession.date) : 'Complete',
            variant: 'info',
            icon: <Calendar className="w-3 h-3 text-purple-700" />,
          }}
          onClick={() => navigate('/patient/appointments')}
        />

        {/* Card 4: Overall Progress % */}
        <StatCard
          label="Overall Progress"
          value={`${stats.progressPercent}%`}
          context={`${stats.completed} of ${stats.total} sessions finished`}
          trend={{
            text: '+14% this week',
            variant: 'success',
            icon: <TrendingUp className="w-3 h-3 text-emerald-600" />,
          }}
          onClick={() => navigate('/patient/therapy-plan')}
        />
      </div>

      {/* 3. Pending Feedback Banner if any session needs review */}
      {pendingFeedbackSessions.length > 0 && (
        <Card className="border border-purple-200/90 bg-purple-50/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
                Session Feedback Requested
              </span>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 font-serif">
                How was your &quot;{pendingFeedbackSessions[0].stageName}&quot; session?
              </h4>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Conducted with {pendingFeedbackSessions[0].therapistName}. Your feedback personalizes upcoming procedures.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/patient/feedback')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="bg-purple-700 hover:bg-purple-800"
          >
            Give Session Feedback
          </Button>
        </Card>
      )}

      {/* 4. Featured Spotlight: Next Session Card */}
      <UpcomingSessionCard
        session={nextSession}
        onViewDetails={() => navigate('/patient/appointments')}
      />

      {/* 5. Therapy Progress Timeline */}
      <TherapyProgressTracker
        stages={plan.stages}
        currentStageName={plan.currentStageName}
        onSelectStage={() => {}}
      />

      {/* 6. Quick Care Shortcuts & Lifestyle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diet Card Shortcut */}
        <Card
          onClick={() => setIsDietModalOpen(true)}
          className="border border-ayur-sand/60 p-5 cursor-pointer hover:border-purple-300 transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 font-serif">
                  Ayurvedic Diet & Meal Schedule
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Dosha balancing recipes, permitted herbal drinks, and Pathya rules.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>
        </Card>

        {/* Prescriptions Shortcut */}
        <Card
          onClick={() => setIsPrescriptionOpen(true)}
          className="border border-ayur-sand/60 p-5 cursor-pointer hover:border-purple-300 transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 font-serif">
                  Herbal Prescriptions & Anupana
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {prescriptions?.medications.length || 4} active herbal formulations prescribed by {plan.doctorName}.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>
        </Card>
      </div>

      {/* Prescription Drawer / Modal */}
      <PrescriptionDrawer
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        prescription={prescriptions || null}
      />

      {/* Diet Plan Modal */}
      {prescriptions?.dietPlan && (
        <Modal
          isOpen={isDietModalOpen}
          onClose={() => setIsDietModalOpen(false)}
          title="Ayurvedic Diet & Meal Protocol"
          subtitle={prescriptions.dietPlan.doshaTarget}
          maxWidth="xl"
          footer={
            <Button variant="primary" size="sm" onClick={() => setIsDietModalOpen(false)}>
              Close
            </Button>
          }
        >
          <DietPlanCard dietPlan={prescriptions.dietPlan} />
        </Modal>
      )}
    </div>
  );
};

export default PatientDashboard;
