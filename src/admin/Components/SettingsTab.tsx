import { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, HelpCircle, BellRing, Smartphone } from 'lucide-react';

export const SettingsTab = () => {
    const [clinicName, setClinicName] = useState('AyurSutra Wellness Center');
    const [ayushCode, setAyushCode] = useState('AYU-HOSP-7890-ND');
    const [address, setAddress] = useState('Sector 4, Dwarka, New Delhi, India');
    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [autoReminder, setAutoReminder] = useState(true);

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Clinic Settings & Configurations</h2>
                <p className="text-sm text-slate-500">Configure AYUSH certifications, patient reminder schedules, and admin authentication parameters.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* Profile Form (8 Cols) */}
                <form onSubmit={handleSave} className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col gap-5 text-xs font-semibold">
                    <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-800" />
                        Official Clinic Profile
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-500">Registered Clinic Name *</label>
                            <input 
                                type="text"
                                required
                                value={clinicName}
                                onChange={(e) => setClinicName(e.target.value)}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-500">AYUSH Accreditation Code *</label>
                            <input 
                                type="text"
                                required
                                value={ayushCode}
                                onChange={(e) => setAyushCode(e.target.value)}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-500">Registered Address</label>
                        <input 
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none"
                        />
                    </div>

                    <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2 border-b border-slate-50 pt-3 pb-3">
                        <BellRing className="h-5 w-5 text-emerald-800" />
                        Patient Communication Gateways
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">WhatsApp Business integration</h4>
                                <p className="text-[11px] text-slate-400 font-medium">Sends automated credentials and daily dietary instructions.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={whatsappEnabled}
                                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-800 accent-emerald-800"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-850 text-sm">SMS Gateway (Fallback)</h4>
                                <p className="text-[11px] text-slate-400 font-medium">Dispatches verification codes if WhatsApp delivery fails.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={smsEnabled}
                                onChange={(e) => setSmsEnabled(e.target.checked)}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-800 accent-emerald-800"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Auto Reminders Schedule</h4>
                                <p className="text-[11px] text-slate-400 font-medium">Notify therapists 30 mins before scheduled procedures.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={autoReminder}
                                onChange={(e) => setAutoReminder(e.target.checked)}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-800 accent-emerald-800"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-emerald-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-950 transition flex items-center justify-center gap-1.5 mt-2"
                    >
                        {saving ? (
                            <span>Saving Configurations...</span>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Profile Changes
                            </>
                        )}
                    </button>
                </form>

                {/* Info Block (4 Cols) */}
                <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col gap-4">
                    <h4 className="font-bold text-slate-800 text-sm">System Compliance</h4>
                    
                    <div className="rounded-xl bg-slate-50 border border-slate-200/50 p-4 text-[11px] leading-relaxed font-semibold text-slate-650 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-emerald-800" />
                            <span>Gateway Status: Active</span>
                        </div>
                        <p className="font-medium text-slate-500">
                            Clinic credentials delivery rates are at 98.4%. The SMS fallback gateway was invoked 2 times today.
                        </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50/40 border border-emerald-200/50 p-4 text-[11px] leading-relaxed font-semibold text-emerald-850 flex flex-col gap-2">
                        <p className="font-bold text-emerald-900 uppercase tracking-wide">Data Compliance Verification</p>
                        <p className="font-medium text-emerald-800">
                            All patient credentials hashes are encrypted on-premise before transfer. Compliance parameters conform to national health-data architectures (ABDM).
                        </p>
                    </div>
                </div>

            </div>

            {/* Success Toast */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                    <span>Configurations saved successfully.</span>
                </div>
            )}

        </div>
    );
};
