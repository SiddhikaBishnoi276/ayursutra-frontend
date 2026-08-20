// src/Doctor/Pages/ReportsPage.tsx
import React, { useState } from 'react';
import { useReports } from '../Hooks/useReports';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { BackButton } from '../../Common/Components/BackButton';
import {
  FileText,
  Download,
  Mail,
  Award,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';

import { PatientSwitcher } from '../Components/PatientSwitcher';
import { Patient } from '../types/doctor.types';

export interface ReportsPageProps {
  patient?: Patient;
  onBack?: () => void;
  onSelectPatient?: (patient: Patient) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ patient, onBack, onSelectPatient }) => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    emailStatus,
    handleDownloadPDF,
    handleEmailReport,
  } = useReports(patient?.id);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && <BackButton onClick={onBack} label="Back" className="mt-0.5" />}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                Clinical Outcome Reports & Discharge Certificates
              </h1>
              <Badge variant="ayur" size="sm">
                Patient: {selectedPatient.name} ({selectedPatient.id})
              </Badge>
              <Badge variant="info" size="sm">
                AYUSH Standard Formats
              </Badge>
            </div>
            <p className="text-sm text-ayur-green-mid font-medium mt-1">
              Generate, print, and securely dispatch official Panchakarma clinical summary certificates.
            </p>
          </div>
        </div>

        {/* Action Buttons & Switcher */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <PatientSwitcher
            selectedPatientId={selectedPatientId}
            onSelectPatient={(p) => {
              setSelectedPatientId(p.id);
              if (onSelectPatient) {
                onSelectPatient(p);
              }
            }}
          />

          <Button
            variant="outline"
            icon={<Printer className="w-4 h-4" />}
            onClick={handleDownloadPDF}
          >
            Download / Print PDF
          </Button>

          <Button
            variant="primary"
            icon={<Mail className="w-4 h-4" />}
            onClick={handleEmailReport}
            disabled={emailStatus === 'sending'}
          >
            {emailStatus === 'sending'
              ? 'Sending Email...'
              : emailStatus === 'sent'
              ? 'Emailed to Patient!'
              : 'Email to Patient'}
          </Button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <Card className="p-8 flex flex-col gap-6 bg-white border-2 border-ayur-sand shadow-sm max-w-4xl mx-auto w-full">
        {/* Certificate Letterhead */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-ayur-primary/20 pb-6 text-center sm:text-left">
          <div>
            <span className="font-serif font-black text-2xl text-ayur-primary tracking-tight block">
              AyurSutra Panchakarma Hospital
            </span>
            <span className="text-xs text-ayur-brown font-bold tracking-widest uppercase block mt-0.5">
              NABH & AYUSH Accredited Clinical Center • Reg No: AYUSH-MH-2026-8819
            </span>
            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
              108 Dhanvantari Marg, Shivajinagar, Pune - 411005
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <span className="w-12 h-12 rounded-full bg-[#fbf9f5] border border-ayur-primary/30 text-ayur-primary flex items-center justify-center font-serif font-black text-xl">
              ॐ
            </span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
              Discharge Certificate
            </span>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-2">
          <h2 className="text-xl font-bold font-serif text-gray-900 tracking-wide uppercase">
            Clinical Panchakarma Therapy Completion Certificate
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            This is to certify that the patient specified below has successfully completed a structured classical Panchakarma regimen.
          </p>
        </div>

        {/* Patient & Therapy Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-gray-500 block">Patient Name</span>
            <span className="font-bold text-gray-900 font-serif text-sm">{selectedPatient.name}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-gray-500 block">Age / Gender / ID</span>
            <span className="font-bold text-gray-900">{selectedPatient.age}y / {selectedPatient.gender} / {selectedPatient.id}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-gray-500 block">Ayurvedic Diagnosis</span>
            <span className="font-bold text-ayur-primary">{selectedPatient.diagnosis}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-gray-500 block">Dominant Prakriti</span>
            <span className="font-bold text-amber-700">{selectedPatient.dominantPrakriti || 'Vata-Pitta'}</span>
          </div>
        </div>

        {/* Outcome Comparison Matrix */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ayur-primary font-serif">
            Efficacy & Biomarker Outcome Matrix
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px]">
                  <th className="p-2.5 border">Parameter</th>
                  <th className="p-2.5 border">Pre-Treatment Baseline</th>
                  <th className="p-2.5 border">Post-Treatment Outcome</th>
                  <th className="p-2.5 border">Clinical Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-800 font-medium">
                <tr>
                  <td className="p-2.5 border font-bold">Pain Score (VAS 0-10)</td>
                  <td className="p-2.5 border text-rose-700">8.5 / 10 (Severe)</td>
                  <td className="p-2.5 border text-emerald-700 font-bold">1.8 / 10 (Minimal)</td>
                  <td className="p-2.5 border text-emerald-700 font-bold">82% Pain Relief</td>
                </tr>
                <tr>
                  <td className="p-2.5 border font-bold">Blood Pressure</td>
                  <td className="p-2.5 border">130/84 mmHg</td>
                  <td className="p-2.5 border text-emerald-700">120/76 mmHg</td>
                  <td className="p-2.5 border">Normotensive Shift</td>
                </tr>
                <tr>
                  <td className="p-2.5 border font-bold">Digestive Fire (Agni)</td>
                  <td className="p-2.5 border text-amber-700">Vishamagni</td>
                  <td className="p-2.5 border text-emerald-700">Samagni</td>
                  <td className="p-2.5 border">Full Metabolic Restoration</td>
                </tr>
                <tr>
                  <td className="p-2.5 border font-bold">Protocol Adherence</td>
                  <td className="p-2.5 border" colSpan={2}>96.8% Full Regimen Compliance</td>
                  <td className="p-2.5 border text-emerald-700 font-bold">Grade A Adherence</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Signatures */}
        <div className="flex items-end justify-between pt-8 border-t border-gray-200 mt-4 text-xs">
          <div>
            <span className="text-gray-500 block">Date of Issue: {new Date().toLocaleDateString()}</span>
            <span className="text-gray-500 block">Certificate No: AS-CERT-{selectedPatient.id}</span>
          </div>

          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-1"></div>
            <span className="font-bold text-gray-900 font-serif block">Dr. Vaidya Shrikant</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Chief Ayurvedic Physician</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
