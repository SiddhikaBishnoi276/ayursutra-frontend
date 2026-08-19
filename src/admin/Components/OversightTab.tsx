import { useState } from 'react';
import { NotificationLog, TherapyPackage, ActivityLog } from '../types/admin.types';
import { 
    Send, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    ShieldAlert, 
    Activity,
    Lock
} from 'lucide-react';

interface OversightTabProps {
    notifications: NotificationLog[];
    packages: TherapyPackage[];
    activities: ActivityLog[];
    onRetryNotification: (id: string) => void;
    onApprovePackage: (id: string) => void;
}

export const OversightTab = ({ 
    notifications, 
    packages, 
    activities, 
    onRetryNotification, 
    onApprovePackage 
}: OversightTabProps) => {
    const [subTab, setSubTab] = useState<'notifications' | 'packages' | 'credentials'>('notifications');
    const [retryingId, setRetryingId] = useState<string | null>(null);

    // Toast alert
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const handleRetry = (id: string) => {
        setRetryingId(id);
        setTimeout(() => {
            onRetryNotification(id);
            setRetryingId(null);
            setToastMsg('Notification dispatched successfully via secondary SMS Gateway.');
            setTimeout(() => setToastMsg(null), 3000);
        }, 1200);
    };

    const pendingAudits = packages.filter(p => p.status === 'Pending Audit');

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">System Oversight & Auditing</h2>
                <p className="text-sm text-slate-500">Track credential delivery, resolve gateway failures, and approve medical templates.</p>
            </div>

            {/* Sub-navigation Toggles */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setSubTab('notifications')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                        subTab === 'notifications' 
                            ? 'border-emerald-900 text-emerald-950 font-extrabold' 
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    Notification Delivery Status ({notifications.length})
                </button>
                <button
                    onClick={() => setSubTab('packages')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition relative ${
                        subTab === 'packages' 
                            ? 'border-emerald-900 text-emerald-950 font-extrabold' 
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    Protocol Audits
                    {pendingAudits.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2">
                            {pendingAudits.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setSubTab('credentials')}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                        subTab === 'credentials' 
                            ? 'border-emerald-900 text-emerald-950 font-extrabold' 
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    Patient Credentials Tracker
                </button>
            </div>

            {/* Sub-Tab 1: Notifications Status */}
            {subTab === 'notifications' && (
                <div className="flex flex-col gap-4">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-4">Recipient</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Channel</th>
                                    <th className="px-5 py-4">Message Log</th>
                                    <th className="px-5 py-4">Delivery Status</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {notifications.map((log) => {
                                    const isFailed = log.status === 'Failed';
                                    return (
                                        <tr 
                                            key={log.id} 
                                            className={`hover:bg-slate-50/50 transition ${
                                                isFailed ? 'bg-red-50/30' : ''
                                            }`}
                                        >
                                            <td className="px-5 py-4 font-bold text-slate-800">{log.recipientName}</td>
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                    {log.recipientRole}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-650">{log.channel}</td>
                                            <td className="px-5 py-4 max-w-xs truncate text-xs text-slate-500 font-medium" title={log.message}>
                                                {log.message}
                                            </td>
                                            <td className="px-5 py-4">
                                                {log.status === 'Sent' ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                                        Delivered
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded-full border border-red-200/50">
                                                        Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {isFailed && (
                                                    <button
                                                        onClick={() => handleRetry(log.id)}
                                                        disabled={retryingId === log.id}
                                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-950 transition disabled:opacity-50"
                                                    >
                                                        {retryingId === log.id ? (
                                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="h-3.5 w-3.5" />
                                                        )}
                                                        Retry Gateway
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sub-Tab 2: Protocol Audits */}
            {subTab === 'packages' && (
                <div className="flex flex-col gap-4">
                    {pendingAudits.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingAudits.map((pkg) => (
                                <div key={pkg.id} className="rounded-xl border border-amber-200 bg-amber-50/10 p-5 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-slate-800 text-base">{pkg.name}</h3>
                                                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                                                    Needs Doctor Verification
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{pkg.description}</p>
                                        </div>
                                        <button
                                            onClick={() => onApprovePackage(pkg.id)}
                                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-950 transition shadow-sm"
                                        >
                                            Audit & Publish
                                        </button>
                                    </div>

                                    {/* Stages preview */}
                                    <div className="border-t border-amber-200/50 pt-3">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedural stages ({pkg.stages.length})</h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {pkg.stages.map((stg) => (
                                                <span key={stg.id} className="text-xs font-semibold bg-white border border-slate-200 text-slate-650 px-2.5 py-1 rounded-lg">
                                                    {stg.stageName} (Day {stg.dayOffset})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 font-medium">
                            No doctor-submitted protocols require auditing at this time.
                        </div>
                    )}
                </div>
            )}

            {/* Sub-Tab 3: Credentials Tracker */}
            {subTab === 'credentials' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2">
                            <Lock className="h-5 w-5 text-emerald-800" />
                            Patient Login Credentials Tracker
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Tracks automated TEMP-PIN generations and credential tokens delivery to new patients.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
                                    <th className="px-4 py-3">Patient Account</th>
                                    <th className="px-4 py-3">Temp Login ID</th>
                                    <th className="px-4 py-3">Verification Hash</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                                <tr>
                                    <td className="px-4 py-3.5 font-bold text-slate-800">Rahul Verma</td>
                                    <td className="px-4 py-3.5 font-mono">rahulv</td>
                                    <td className="px-4 py-3.5 font-mono text-slate-400">0x9a8f...102a</td>
                                    <td className="px-4 py-3.5 text-red-750">SMS Delivery Failed (Retry Pending)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3.5 font-bold text-slate-800">Sandeep Patil</td>
                                    <td className="px-4 py-3.5 font-mono">sandeepp</td>
                                    <td className="px-4 py-3.5 font-mono text-slate-400">0x4b7c...9081</td>
                                    <td className="px-4 py-3.5 text-emerald-700">✓ Logged In (Token Active)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3.5 font-bold text-slate-800">Anil Kadam</td>
                                    <td className="px-4 py-3.5 font-mono">anilkadam</td>
                                    <td className="px-4 py-3.5 font-mono text-slate-400">0x2f11...8763</td>
                                    <td className="px-4 py-3.5 text-emerald-700">WhatsApp Delivered (Pending First Login)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {toastMsg && (
                <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4.5 py-3 text-sm font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>{toastMsg}</span>
                </div>
            )}

        </div>
    );
};
