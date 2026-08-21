// src/Patient/Pages/ProfilePage.tsx
// Screen 5: Read-Only Patient Medical Profile, Allergy Flags, Assigned Doctor & Therapist

import React from 'react';
import {
  AlertTriangle,
  Heart,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { BackButton } from '../../Common/Components/BackButton';
import { Skeleton } from '../../Common/Components/Skeleton';
import { useGetMyProfileQuery } from '../apis/patientApi';

export const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-44" />
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/dashboard" label="Dashboard" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif tracking-tight">
              Patient Clinical Profile
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
              Read-only clinical records verified by AyurSutra Medical Administration
            </p>
          </div>
        </div>

        <Badge variant="ayur" size="md">
          AYUSH ID: {profile.id}
        </Badge>
      </div>

      {/* 2. Personal Information Card */}
      <Card className="border border-ayur-sand/70 p-5 sm:p-6 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 text-2xl font-bold font-serif border border-purple-200 shrink-0">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
                  {profile.name}
                </h2>
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                  Verified Patient
                </Badge>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {profile.age} Years • {profile.gender} • Member Since {profile.memberSince}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Ayurvedic Constitution (Prakriti)
            </span>
            <span className="text-base font-bold text-purple-700 font-serif mt-0.5">
              {profile.prakritiType}
            </span>
          </div>
        </div>

        {/* Contact & Demographics Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-gray-700">
          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-purple-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Phone</span>
              <span className="font-semibold text-gray-900 truncate block">{profile.contact}</span>
            </div>
          </div>

          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-purple-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Email</span>
              <span className="font-semibold text-gray-900 truncate block">{profile.email}</span>
            </div>
          </div>

          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Address</span>
              <span className="font-semibold text-gray-900 truncate block">{profile.address}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Clinical Sensitivities, Allergies & Medical Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allergies & Sensitivities (Amber Banner) */}
        <Card className="border border-amber-200/80 bg-amber-50/50 p-5 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="text-sm font-bold text-amber-950 font-serif">
              Known Allergies & Sensitivities
            </h3>
          </div>

          <div className="mt-3.5 space-y-2">
            {profile.allergies.map((allergy, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/90 border border-amber-200 text-xs font-semibold text-amber-900 shadow-2xs"
              >
                ⚠️ {allergy}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-amber-800 font-medium mt-3 leading-relaxed">
            All therapists are pre-notified of these clinical sensitivities before any oil or decoction preparation.
          </p>
        </Card>

        {/* Diagnosed Conditions & Vikriti */}
        <Card className="border border-stone-200 p-5 bg-white shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Heart className="w-5 h-5 text-purple-700 shrink-0" />
            <h3 className="text-sm font-bold text-gray-900 font-serif">
              Medical Conditions & Dosha Imbalance
            </h3>
          </div>

          <div className="mt-3.5 space-y-2">
            {profile.medicalConditions.map((cond, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-gray-800"
              >
                • {cond}
              </div>
            ))}
          </div>

          {profile.vikriti && (
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-xs">
              <span className="font-bold text-gray-700 block mb-0.5">Ayurvedic Pathogenesis (Vikriti):</span>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                {profile.vikriti}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* 4. Assigned Doctor and Primary Therapist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doctor Card */}
        <Card className="border border-ayur-sand/70 p-5 bg-white shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Stethoscope className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-serif">
                Supervising Ayurvedic Physician
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">
                Clinical oversight & protocol designer
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-gray-900 font-serif">
              {profile.assignedDoctor.name}
            </h4>
            <p className="text-xs text-ayur-brown font-semibold mt-0.5">
              {profile.assignedDoctor.qualification} • {profile.assignedDoctor.specialty}
            </p>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{profile.assignedDoctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{profile.assignedDoctor.phone}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Therapist Card */}
        <Card className="border border-ayur-sand/70 p-5 bg-white shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Award className="w-5 h-5 text-purple-700 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-serif">
                Assigned Lead Therapist
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">
                Certified procedure administrator
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-gray-900 font-serif">
              {profile.assignedTherapist.name}
            </h4>
            <p className="text-xs text-purple-700 font-semibold mt-0.5">
              {profile.assignedTherapist.specialty} • {profile.assignedTherapist.experienceYears} Years Experience
            </p>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{profile.assignedTherapist.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{profile.assignedTherapist.phone}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Emergency Contact */}
      {profile.emergencyContact && (
        <Card className="border border-stone-200/80 p-4 sm:p-5 bg-[#fbf9f5] shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Designated Emergency Contact
              </span>
              <span className="text-sm font-bold text-gray-900 font-serif block mt-0.5">
                {profile.emergencyContact.name} ({profile.emergencyContact.relation})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-700" />
              <span className="font-bold text-gray-900 text-sm">
                {profile.emergencyContact.phone}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
