import { useState } from 'react';
import { StaffMember } from '../types/admin.types';
import { 
    Plus, 
    Search, 
    Eye, 
    Edit2, 
    UserX, 
    UserCheck, 
    X, 
    ShieldCheck, 
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';

interface StaffTabProps {
    staff: StaffMember[];
    onAddStaff: (member: Omit<StaffMember, 'id' | 'status'>) => void;
    onSuspendStaff: (id: string) => { success: boolean; error?: string };
    onActivateStaff: (id: string) => void;
    onEditStaff: (member: StaffMember) => void;
}

export const StaffTab = ({ 
    staff, 
    onAddStaff, 
    onSuspendStaff, 
    onActivateStaff, 
    onEditStaff 
}: StaffTabProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'doctor' | 'therapist'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');

    // Add/Edit Practitioner Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'therapist' as 'doctor' | 'therapist',
        specialization: '',
        gender: 'Male' as 'Male' | 'Female',
        registrationNum: ''
    });

    // View Profile Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

    // Suspension / Activation Modal State
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [pendingActionMember, setPendingActionMember] = useState<StaffMember | null>(null);
    const [actionType, setActionType] = useState<'suspend' | 'activate'>('suspend');

    // Success Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const handleOpenAddDrawer = () => {
        setIsEditing(false);
        setEditingStaffId(null);
        setFormData({
            fullName: '',
            email: '',
            role: 'therapist',
            specialization: '',
            gender: 'Male',
            registrationNum: ''
        });
        setDrawerOpen(true);
    };

    const handleOpenEditDrawer = (member: StaffMember) => {
        setIsEditing(true);
        setEditingStaffId(member.id);
        setFormData({
            fullName: member.fullName,
            email: member.email,
            role: member.role,
            specialization: member.specialization,
            gender: member.gender,
            registrationNum: member.registrationNum || ''
        });
        setDrawerOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.specialization) {
            alert('Please fill out all required fields.');
            return;
        }

        if (isEditing && editingStaffId) {
            const originalMember = staff.find(s => s.id === editingStaffId);
            onEditStaff({
                id: editingStaffId,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                specialization: formData.specialization,
                gender: formData.gender,
                status: originalMember ? originalMember.status : 'Active',
                registrationNum: formData.role === 'doctor' ? formData.registrationNum : undefined
            });
            showToast('Practitioner profile updated successfully.');
        } else {
            onAddStaff({
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                specialization: formData.specialization,
                gender: formData.gender,
                registrationNum: formData.role === 'doctor' ? formData.registrationNum : undefined
            });
            showToast('Practitioner registered & verified by Admin.');
        }

        setDrawerOpen(false);
    };

    const handleActionClick = (member: StaffMember, type: 'suspend' | 'activate') => {
        setPendingActionMember(member);
        setActionType(type);
        setConfirmModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (!pendingActionMember) return;
        
        if (actionType === 'suspend') {
            onSuspendStaff(pendingActionMember.id);
            showToast(`Suspended ${pendingActionMember.role} ${pendingActionMember.fullName}.`);
        } else {
            onActivateStaff(pendingActionMember.id);
            showToast(`Reactivated ${pendingActionMember.role} ${pendingActionMember.fullName}.`);
        }
        setConfirmModalOpen(false);
        setPendingActionMember(null);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    // Filter staff
    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             member.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' ? true : member.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ? true : member.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Check if therapist has active sessions
    const hasActiveSession = (id: string) => {
        // Pooja Nair (S-102) has active enema session in Room 102
        return id === 'S-102';
    };

    return (
        <div className="flex flex-col gap-6 relative">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Staff & Practitioner Directory</h2>
                    <p className="text-sm text-slate-500">Add medical practitioners, verify AYUSH registrations, and configure gender mappings.</p>
                </div>
                
                <button
                    onClick={handleOpenAddDrawer}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 shadow-sm transition"
                    title="Add a new doctor or therapist to the directory"
                    tabIndex={0}
                >
                    <Plus className="h-4.5 w-4.5" />
                    Add Practitioner
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
                
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:bg-white transition outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-650 outline-none"
                        title="Filter by Practitioner Role"
                    >
                        <option value="all">All Roles</option>
                        <option value="doctor">Doctors</option>
                        <option value="therapist">Therapists</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-650 outline-none"
                        title="Filter by Practitioner Status"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>

            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <th className="px-5 py-4">Practitioner</th>
                            <th className="px-5 py-4">Role / Verification</th>
                            <th className="px-5 py-4">Credentials & Reg. No.</th>
                            <th className="px-5 py-4">Gender Mapping</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition">
                                    {/* Practitioner Details */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm text-white ${
                                                member.role === 'doctor' 
                                                    ? 'bg-gradient-to-br from-emerald-800 to-teal-900 shadow-sm shadow-emerald-900/10' 
                                                    : 'bg-gradient-to-br from-amber-700 to-amber-900 shadow-sm shadow-amber-900/10'
                                            }`}>
                                                {getInitials(member.fullName)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                                    {member.fullName}
                                                    {member.role === 'doctor' && (
                                                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-700 animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role & Verification Badge */}
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {member.role === 'doctor' ? (
                                                <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                                                    Doctor
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200/50 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                                                    Therapist
                                                </span>
                                            )}
                                            <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 rounded">
                                                Verified by Admin
                                            </span>
                                        </div>
                                    </td>

                                    {/* Reg No / Specialization */}
                                    <td className="px-5 py-4 font-mono text-xs text-slate-650">
                                        {member.role === 'doctor' ? (
                                            <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-bold text-slate-700">
                                                {member.registrationNum || 'N/A'}
                                            </span>
                                        ) : (
                                            <span className="bg-slate-150 px-2.5 py-1 rounded border border-slate-200 font-bold text-slate-700">
                                                {member.specialization}
                                            </span>
                                        )}
                                    </td>

                                    {/* Gender (Same-gender matching requirement) */}
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/50">
                                            {member.gender} Only
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        {member.status === 'Active' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-750 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                                Suspended
                                            </span>
                                        )}
                                    </td>

                                    {/* Row actions */}
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <button 
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setViewModalOpen(true);
                                                }}
                                                title={`View ${member.fullName}'s Profile`}
                                                tabIndex={0}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                                            >
                                                <Eye className="h-4.5 w-4.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEditDrawer(member)}
                                                title={`Edit Details for ${member.fullName}`}
                                                tabIndex={0}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                                            >
                                                <Edit2 className="h-4.5 w-4.5" />
                                            </button>
                                            {member.status === 'Active' ? (
                                                <button
                                                    onClick={() => handleActionClick(member, 'suspend')}
                                                    title={`Suspend ${member.fullName}`}
                                                    tabIndex={0}
                                                    className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-550"
                                                >
                                                    <UserX className="h-4.5 w-4.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActionClick(member, 'activate')}
                                                    title={`Reactivate ${member.fullName}`}
                                                    tabIndex={0}
                                                    className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                                >
                                                    <UserCheck className="h-4.5 w-4.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400 font-medium">
                                    No practitioners found matching search filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Success Toast */}
            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4.5 py-3 text-sm font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Read-Only Side-Drawer / Modal (View Profile) */}
            {viewModalOpen && selectedMember && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-md bg-[#fbf9f6] p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col justify-between border-l border-slate-200">
                        <div>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Practitioner Profile</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Clinical credential status overview.</p>
                                </div>
                                <button 
                                    onClick={() => setViewModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 transition"
                                    title="Close Profile Details"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Profile Info Cards */}
                            <div className="mt-6 flex flex-col gap-5 text-xs font-semibold text-slate-650">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-3xs">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-full font-bold text-lg text-white ${
                                        selectedMember.role === 'doctor' 
                                            ? 'bg-gradient-to-br from-emerald-800 to-teal-900 shadow-sm' 
                                            : 'bg-gradient-to-br from-amber-700 to-amber-900 shadow-sm'
                                    }`}>
                                        {getInitials(selectedMember.fullName)}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                                            {selectedMember.fullName}
                                            {selectedMember.role === 'doctor' && (
                                                <ShieldCheck className="h-4.5 w-4.5 text-emerald-700" />
                                            )}
                                        </h4>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                            {selectedMember.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col gap-3">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Email Address</span>
                                        <span className="text-slate-800 font-bold">{selectedMember.email}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Clinical Focus / Specialization</span>
                                        <span className="text-slate-800 font-bold">{selectedMember.specialization}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">AYUSH Reg. Number</span>
                                        <span className="text-slate-800 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded">
                                            {selectedMember.registrationNum || 'Verified Therapist (No Reg. ID Required)'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Gender Treatment Assignment</span>
                                        <span className="text-slate-800 font-bold">{selectedMember.gender} Patient Only</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Portal Login Access Status</span>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                                            selectedMember.status === 'Active' ? 'text-emerald-700' : 'text-red-750'
                                        }`}>
                                            {selectedMember.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit lines footer */}
                        <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
                            <span className="text-[10px] text-slate-400 font-medium italic text-center">
                                verified_by_admin: system audit hash verified by AyurSutra. Onboarded: August 19, 2026.
                            </span>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-950 transition"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Practitioner Side-Drawer (Slide-out panel) */}
            {drawerOpen && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {isEditing ? 'Modify Practitioner Profile' : 'Add Clinic Practitioner'}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Admin-only secure credential verification registration.</p>
                                </div>
                                <button 
                                    onClick={() => setDrawerOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                                    title="Close Form Drawer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form id="add-staff-form" onSubmit={handleFormSubmit} className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Full Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Dr. Ramesh Kumar"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Email Address *</label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="e.g. ramesh@ayursutra.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none"
                                    >
                                        <option value="therapist">Therapist</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Gender *</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Specialization Tags / Focus area *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Basti-trained, Kaya Chikitsa"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-855 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                {formData.role === 'doctor' && (
                                    <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-155">
                                        <label className="text-slate-500">AYUSH Medical Registration Number *</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="e.g. AYU-2026-9081"
                                            value={formData.registrationNum}
                                            onChange={(e) => setFormData(prev => ({ ...prev, registrationNum: e.target.value }))}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                        />
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-slate-100 pt-4 flex gap-3">
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="add-staff-form"
                                className="flex-1 rounded-lg bg-emerald-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-950 transition"
                            >
                                {isEditing ? 'Save Changes' : 'Register Practitioner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation & Active Session Block Warnings (Action Modals) */}
            {confirmModalOpen && pendingActionMember && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
                        
                        {/* Title */}
                        <div className={`flex items-center gap-3 ${
                            actionType === 'suspend' ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                            <div className={`rounded-full p-2 border ${
                                actionType === 'suspend' ? 'bg-amber-50 border-amber-250' : 'bg-emerald-50 border-emerald-250'
                            }`}>
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h4 className="text-base font-extrabold text-slate-850">
                                {actionType === 'suspend' ? 'Practitioner Suspension Check' : 'Reactivate Practitioner'}
                            </h4>
                        </div>

                        {/* Consequence Text */}
                        <div className="text-xs font-semibold text-slate-600 leading-relaxed flex flex-col gap-3">
                            {actionType === 'suspend' ? (
                                hasActiveSession(pendingActionMember.id) ? (
                                    /* BLOCKING WARNING: Pooja Nair has active enema session */
                                    <div className="flex flex-col gap-2">
                                        <p className="text-red-750 font-bold bg-red-50 p-3 rounded-lg border border-red-200/50">
                                            ⚠️ Blocked Action: Active Session In Progress
                                        </p>
                                        <p>
                                            {pendingActionMember.role === 'doctor' ? 'Dr.' : 'Therapist'} {pendingActionMember.fullName} has an active session right now. This practitioner can only be suspended once the session is completed or reassigned.
                                        </p>
                                    </div>
                                ) : (
                                    /* Standard Suspension Confirmation */
                                    <p>
                                        Are you sure you want to suspend {pendingActionMember.fullName}? They will lose dashboard access immediately and won't be assignable to new therapy sessions.
                                    </p>
                                )
                            ) : (
                                /* Reactivation Confirmation */
                                <p>
                                    Are you sure you want to reactivate {pendingActionMember.fullName}? They will be immediately available to manage treatments and accept new patient bookings.
                                </p>
                            )}
                        </div>

                        {/* Control Actions */}
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => {
                                    setConfirmModalOpen(false);
                                    setPendingActionMember(null);
                                }}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={actionType === 'suspend' && hasActiveSession(pendingActionMember.id)}
                                className={`flex-1 rounded-lg py-2.5 text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed ${
                                    actionType === 'suspend' 
                                        ? 'bg-red-700 hover:bg-red-800 disabled:bg-red-300' 
                                        : 'bg-emerald-900 hover:bg-emerald-950'
                                }`}
                            >
                                {actionType === 'suspend' ? 'Confirm Suspend' : 'Confirm Reactivate'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};
