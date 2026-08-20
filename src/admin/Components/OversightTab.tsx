import React, { useState } from 'react';
import { NotificationLog, TherapyPackage, ActivityLog } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Table, Column } from '../../Common/Components/Table';
import { EmptyState } from '../../Common/Components/EmptyState';
import { ProtocolStageStepper } from './ProtocolStageStepper';
import { ShieldCheck, RefreshCw, Send, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';

interface OversightTabProps {
  notifications: NotificationLog[];
  packages: TherapyPackage[];
  activities: ActivityLog[];
  onRetryNotification?: (id: string) => void;
  onApprovePackage?: (id: string) => void;
}

export const OversightTab: React.FC<OversightTabProps> = ({
  notifications,
  packages,
  activities,
  onRetryNotification,
  onApprovePackage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notifications' | 'protocolAudit' | 'activityLog'>('notifications');

  const doctorPackages = packages.filter((p) => p.createdBy === 'doctor' || p.status === 'Pending Audit');
  const failedNotificationsCount = notifications.filter((n) => n.status === 'Failed').length;

  const notifColumns: Column<NotificationLog>[] = [
    {
      header: 'Recipient',
      accessorKey: 'recipientName',
      render: (item) => (
        <div>
          <p className="font-bold text-gray-900 font-serif">{item.recipientName}</p>
          <Badge variant={item.recipientRole === 'staff' ? 'info' : 'ayur'} size="sm" className="mt-1">
            {item.recipientRole === 'staff' ? 'Staff Member' : 'Patient'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Gateway Channel',
      accessorKey: 'channel',
      render: (item) => (
        <span className="font-semibold text-xs text-gray-700 bg-[#f4f7f4] px-2.5 py-1 rounded-lg border border-ayur-sand/50">
          {item.channel}
        </span>
      ),
    },
    {
      header: 'Dispatch Payload',
      accessorKey: 'message',
      render: (item) => (
        <p className="text-xs text-gray-600 font-medium max-w-md line-clamp-2">
          {item.message}
        </p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (item) => (
        <Badge
          variant={item.status === 'Sent' ? 'success' : 'danger'}
          size="sm"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      render: (item) => (
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {item.timestamp}
        </span>
      ),
    },
    {
      header: 'Action',
      render: (item) =>
        item.status === 'Failed' ? (
          <Button
            variant="ayur"
            size="sm"
            onClick={() => onRetryNotification?.(item.id)}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        ) : (
          <span className="text-xs text-ayur-green-mid font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
          System Oversight & Audit Center
        </h1>
        <p className="text-sm text-ayur-green-mid font-medium mt-1">
          Monitor communications gateway logs, audit doctor-submitted therapy blueprints, and track operations.
        </p>
      </div>

      {/* Sub-Navigation Pill Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('notifications')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            activeSubTab === 'notifications'
              ? 'bg-ayur-primary text-white border-ayur-primary shadow-xs'
              : 'bg-white text-gray-600 border-ayur-sand/80 hover:bg-[#fbf9f5]'
          }`}
        >
          <span>SMS/WhatsApp Delivery Logs ({notifications.length})</span>
          {failedNotificationsCount > 0 && (
            <span className="ml-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {failedNotificationsCount} Failed
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('protocolAudit')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            activeSubTab === 'protocolAudit'
              ? 'bg-ayur-primary text-white border-ayur-primary shadow-xs'
              : 'bg-white text-gray-600 border-ayur-sand/80 hover:bg-[#fbf9f5]'
          }`}
        >
          <span>Doctor Protocol Audits ({doctorPackages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activityLog')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            activeSubTab === 'activityLog'
              ? 'bg-ayur-primary text-white border-ayur-primary shadow-xs'
              : 'bg-white text-gray-600 border-ayur-sand/80 hover:bg-[#fbf9f5]'
          }`}
        >
          <span>Audit Activity Stream ({activities.length})</span>
        </button>
      </div>

      {/* Section 1: Notifications Status */}
      {activeSubTab === 'notifications' && (
        <Table<NotificationLog>
          columns={notifColumns}
          data={notifications}
          keyExtractor={(item) => item.id}
          emptyMessage="No notification logs recorded."
        />
      )}

      {/* Section 2: Doctor Protocol Audits */}
      {activeSubTab === 'protocolAudit' && (
        <div className="flex flex-col gap-5">
          {doctorPackages.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title="All Protocols Audited"
              message="No doctor-submitted protocols currently require administrative audit."
            />
          ) : (
            doctorPackages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900 font-serif">
                        {pkg.name}
                      </h3>
                      <Badge variant="warning" size="sm">
                        Submitted by {pkg.authorName}
                      </Badge>
                      <Badge
                        variant={pkg.status === 'Active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {pkg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {pkg.targetDosha} • {pkg.durationDays} Days Duration • {pkg.stages.length} Stages
                    </p>
                  </div>

                  {pkg.status !== 'Active' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => onApprovePackage?.(pkg.id)}
                    >
                      Approve & Standardize Protocol
                    </Button>
                  ) : (
                    <Badge variant="success" size="md">
                      Approved & Live
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {pkg.description}
                </p>

                {/* Stages */}
                <div className="pt-3 border-t border-gray-100">
                  <ProtocolStageStepper stages={pkg.stages} />
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Section 3: Activity Stream */}
      {activeSubTab === 'activityLog' && (
        <Card>
          <div className="flex flex-col divide-y divide-gray-100">
            {activities.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start gap-3">
                <Badge
                  variant={
                    log.severity === 'critical'
                      ? 'danger'
                      : log.severity === 'warning'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                  className="uppercase tracking-wider font-bold shrink-0 mt-0.5"
                >
                  {log.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-snug">
                    {log.action}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    User: {log.user} ({log.role}) • {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
