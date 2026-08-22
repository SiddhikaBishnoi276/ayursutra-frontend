import React, { useState } from 'react';
import { StaffMember } from '../types/admin.types';
import { Table, Column } from '../../Common/Components/Table';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { EmptyState } from '../../Common/Components/EmptyState';
import { Plus, Users, UserX, UserCheck, Stethoscope } from 'lucide-react';

interface StaffTabProps {
  staff: StaffMember[];
  onAddDoctor?: (data: { fullName: string; email: string; phone: string; registrationNum: string; gender: 'Male' | 'Female'; specialization?: string }) => Promise<any>;
  onAddTherapist?: (data: { fullName: string; email: string; phone: string; specialization: string; gender: 'Male' | 'Female' }) => Promise<any>;
  onToggleStatus?: (id: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staff,
  onAddDoctor,
  onAddTherapist,
  onToggleStatus,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'doctor' | 'therapist' | 'Active' | 'Suspended'>('all');

  // Modals
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [addTherapistOpen, setAddTherapistOpen] = useState(false);

  // Doctor Form State
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docReg, setDocReg] = useState('');
  const [docGender, setDocGender] = useState<'Male' | 'Female'>('Male');
  const [docSpec, setDocSpec] = useState('Kaya Chikitsa & Panchakarma');
  const [docError, setDocError] = useState<string | null>(null);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Therapist Form State
  const [thName, setThName] = useState('');
  const [thEmail, setThEmail] = useState('');
  const [thPhone, setThPhone] = useState('');
  const [thSpec, setThSpec] = useState('');
  const [thGender, setThGender] = useState<'Male' | 'Female'>('Female');
  const [thError, setThError] = useState<string | null>(null);
  const [isSubmittingTh, setIsSubmittingTh] = useState(false);

  const openDoctorModal = () => {
    setDocError(null);
    setIsSubmittingDoc(false);
    setAddDoctorOpen(true);
  };

  const openTherapistModal = () => {
    setThError(null);
    setIsSubmittingTh(false);
    setAddTherapistOpen(true);
  };

  const filteredStaff = staff.filter((member) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'doctor') return member.role === 'doctor';
    if (activeFilter === 'therapist') return member.role === 'therapist';
    if (activeFilter === 'Active') return member.status === 'Active';
    if (activeFilter === 'Suspended') return member.status === 'Suspended';
    return true;
  });

  const filterOptions: { id: 'all' | 'doctor' | 'therapist' | 'Active' | 'Suspended'; label: string; count?: number }[] = [
    { id: 'all', label: 'All Staff', count: staff.length },
    { id: 'doctor', label: 'Doctors', count: staff.filter((s) => s.role === 'doctor').length },
    { id: 'therapist', label: 'Therapists', count: staff.filter((s) => s.role === 'therapist').length },
    { id: 'Active', label: 'Active', count: staff.filter((s) => s.status === 'Active').length },
    { id: 'Suspended', label: 'Suspended', count: staff.filter((s) => s.status === 'Suspended').length },
  ];

  // ── Client-side validation helpers ──
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?\d{10,15}$/.test(phone.replace(/[\s\-()]/g, ''));

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);

    // ── Client-side field validation ──
    const errors: string[] = [];
    if (!docName.trim() || docName.trim().length < 2) errors.push('Full Name is required (min 2 characters).');
    if (!docEmail.trim() || !validateEmail(docEmail.trim())) errors.push('A valid Email Address is required.');
    if (!docPhone.trim() || !validatePhone(docPhone.trim())) errors.push('A valid Mobile Number is required (10-15 digits).');
    if (!docReg.trim() || docReg.trim().length < 3) errors.push('AYUSH Registration Number is required (min 3 characters).');

    if (errors.length > 0) {
      setDocError(errors.join(' '));
      return;
    }

    setIsSubmittingDoc(true);
    try {
      await onAddDoctor?.({
        fullName: docName.trim(),
        email: docEmail.trim(),
        phone: docPhone.trim(),
        registrationNum: docReg.trim(),
        gender: docGender,
        specialization: docSpec.trim(),
      });
      setDocName('');
      setDocEmail('');
      setDocPhone('');
      setDocReg('');
      setDocSpec('Kaya Chikitsa & Panchakarma');
      setAddDoctorOpen(false);
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || 'Failed to onboard doctor. Please try again.';
      setDocError(errMsg);
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleTherapistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setThError(null);

    // ── Client-side field validation ──
    const errors: string[] = [];
    if (!thName.trim() || thName.trim().length < 2) errors.push('Full Name is required (min 2 characters).');
    if (!thEmail.trim() || !validateEmail(thEmail.trim())) errors.push('A valid Email Address is required.');
    if (!thPhone.trim() || !validatePhone(thPhone.trim())) errors.push('A valid Mobile Number is required (10-15 digits).');
    if (!thSpec.trim()) errors.push('Therapy Certifications field is required.');

    if (errors.length > 0) {
      setThError(errors.join(' '));
      return;
    }

    setIsSubmittingTh(true);
    try {
      await onAddTherapist?.({
        fullName: thName.trim(),
        email: thEmail.trim(),
        phone: thPhone.trim(),
        specialization: thSpec.trim(),
        gender: thGender,
      });
      setThName('');
      setThEmail('');
      setThPhone('');
      setThSpec('');
      setAddTherapistOpen(false);
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || 'Failed to onboard therapist. Please try again.';
      setThError(errMsg);
    } finally {
      setIsSubmittingTh(false);
    }
  };

  const columns: Column<StaffMember>[] = [
    {
      header: 'Practitioner',
      accessorKey: 'fullName',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4f7f4] border border-ayur-sand/60 text-ayur-primary flex items-center justify-center font-bold text-xs font-serif shrink-0">
            {(item.fullName || 'Staff Member')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-gray-900 font-serif">{item.fullName}</p>
            <p className="text-xs text-gray-500 font-medium">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      render: (item) => (
        <Badge variant={item.role === 'doctor' ? 'ayur' : 'info'} size="sm">
          {item.role === 'doctor' ? 'Doctor' : 'Therapist'}
        </Badge>
      ),
    },
    {
      header: 'Specialization & Reg #',
      accessorKey: 'specialization',
      render: (item) => (
        <div>
          <p className="text-xs font-semibold text-gray-800">{item.specialization}</p>
          {item.registrationNum && (
            <p className="text-[11px] text-ayur-green-mid font-medium mt-0.5">
              AYUSH Reg: {item.registrationNum}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      render: (item) => (
        <span className="text-xs text-gray-600 font-medium">{item.gender}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (item) => (
        <Badge
          variant={item.status === 'Active' ? 'success' : 'danger'}
          size="sm"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (item) => (
        <Button
          variant={item.status === 'Active' ? 'outline' : 'secondary'}
          size="sm"
          onClick={() => onToggleStatus?.(item.id)}
          icon={item.status === 'Active' ? <UserX className="w-3.5 h-3.5 text-rose-600" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-700" />}
        >
          {item.status === 'Active' ? 'Suspend' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
            Staff & Practitioner Directory
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Manage Ayurvedic doctors, therapists, certification numbers, and duty states.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            onClick={openDoctorModal}
          >
            Add Doctor
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={openTherapistModal}
          >
            Add Therapist
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveFilter(opt.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-ayur-primary text-white border-ayur-primary shadow-xs'
                  : 'bg-white text-gray-600 border-ayur-sand/80 hover:bg-[#fbf9f5] hover:text-ayur-primary'
              }`}
            >
              <span>{opt.label}</span>
              {typeof opt.count === 'number' && (
                <span
                  className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f4f7f4] text-ayur-green-mid'
                  }`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Staff Table */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Staff Found"
          message="No practitioners match this filter selection. Switch filters or add a new doctor/therapist."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Table<StaffMember>
          columns={columns}
          data={filteredStaff}
          keyExtractor={(item) => item.id}
          emptyMessage="No staff records available."
          mobileView="cards"
        />
      )}

      {/* Add Doctor Modal */}
      <Modal
        isOpen={addDoctorOpen}
        onClose={() => setAddDoctorOpen(false)}
        title="Onboard Ayurvedic Doctor"
        subtitle="Register medical credentials and practitioner contact."
      >
        <form onSubmit={handleDoctorSubmit} className="flex flex-col gap-4">
          {docError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold">
              {docError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Full Name *</label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Dr. Ananya Varma"
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Email Address *</label>
              <input
                type="email"
                required
                value={docEmail}
                onChange={(e) => setDocEmail(e.target.value)}
                placeholder="dr.ananya@ayursutra.com"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                required
                value={docPhone}
                onChange={(e) => setDocPhone(e.target.value)}
                placeholder="e.g. +919876543210"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">AYUSH Reg Number *</label>
              <input
                type="text"
                required
                value={docReg}
                onChange={(e) => setDocReg(e.target.value)}
                placeholder="AYU-2024-9081"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Specialization</label>
              <input
                type="text"
                value={docSpec}
                onChange={(e) => setDocSpec(e.target.value)}
                placeholder="Kaya Chikitsa, Shalya Tantra..."
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Gender</label>
            <select
              value={docGender}
              onChange={(e) => setDocGender(e.target.value as 'Male' | 'Female')}
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddDoctorOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmittingDoc}>
              {isSubmittingDoc ? 'Saving...' : 'Save Doctor'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Therapist Modal */}
      <Modal
        isOpen={addTherapistOpen}
        onClose={() => setAddTherapistOpen(false)}
        title="Onboard Ayurvedic Therapist"
        subtitle="Register therapy capabilities and duty profile."
      >
        <form onSubmit={handleTherapistSubmit} className="flex flex-col gap-4">
          {thError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold">
              {thError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Full Name *</label>
            <input
              type="text"
              required
              value={thName}
              onChange={(e) => setThName(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Email Address *</label>
              <input
                type="email"
                required
                value={thEmail}
                onChange={(e) => setThEmail(e.target.value)}
                placeholder="ramesh.c@ayursutra.com"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                required
                value={thPhone}
                onChange={(e) => setThPhone(e.target.value)}
                placeholder="e.g. +919988776655"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Therapy Certifications *</label>
              <input
                type="text"
                required
                value={thSpec}
                onChange={(e) => setThSpec(e.target.value)}
                placeholder="e.g. Abhyanga, Shirodhara, Swedana Certified"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Gender</label>
              <select
                value={thGender}
                onChange={(e) => setThGender(e.target.value as 'Male' | 'Female')}
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddTherapistOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmittingTh}>
              {isSubmittingTh ? 'Saving...' : 'Save Therapist'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
