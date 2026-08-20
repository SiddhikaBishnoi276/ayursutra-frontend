import React from 'react';
import { ActivityLog, StaffMember, Room, TherapyPackage } from '../types/admin.types';
import { StatCard } from '../../Common/Components/StatCard';
import { ActionCard } from '../../Common/Components/ActionCard';
import { ActivityFeedItem } from '../../Common/Components/ActivityFeedItem';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import {
  Users,
  FileSpreadsheet,
  BedDouble,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Database,
  Radio,
  Cpu,
} from 'lucide-react';

interface DashboardTabProps {
  staff: StaffMember[];
  rooms: Room[];
  activities: ActivityLog[];
  packages?: TherapyPackage[];
  onTabChange: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  staff,
  rooms,
  activities,
  packages = [],
  onTabChange,
}) => {
  // Stats calculation
  const activeStaff = staff.filter((s) => s.status === 'Active').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const totalRooms = rooms.length || 4;
  const roomOccupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 75;

  const systemHealthItems = [
    {
      name: 'Database Connection',
      status: 'Healthy',
      variant: 'success' as const,
      icon: Database,
    },
    {
      name: 'SMS/WhatsApp Gateway',
      status: '2 Failed Items',
      variant: 'warning' as const,
      icon: Radio,
    },
    {
      name: 'Treatment Scheduling Engine',
      status: 'Healthy',
      variant: 'success' as const,
      icon: Cpu,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Section A: Greeting Header + Live Date Pill */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 font-serif tracking-tight">
            Welcome back, Admin Director
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Here is the active operational health summary for AyurSutra Hospital today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-ayur-sand/60 px-4 py-2 rounded-full shadow-2xs text-xs font-semibold text-gray-700">
          <Clock className="w-4 h-4 text-ayur-green-mid shrink-0" />
          <span>Wednesday, August 19, 2026</span>
        </div>
      </div>

      {/* Section B: 4-Column Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* Stat 1: Today's Volume */}
        <StatCard
          label="Today's Sessions"
          value="28 Volumes"
          context="18 completed, 10 scheduled remaining"
          trend={{ text: '+12%', variant: 'success' }}
          onClick={() => onTabChange('rooms')}
        />

        {/* Stat 2: Active Staff */}
        <StatCard
          label="Active Staff"
          value={`${activeStaff} On-Duty`}
          context="1 Doctor, 3 Therapists active now"
          trend={{ text: '100% Active', variant: 'info' }}
          onClick={() => onTabChange('staff')}
        />

        {/* Stat 3: Chamber Occupancy */}
        <StatCard
          label="Chamber Occupancy"
          value={`${roomOccupancyRate}% Cap`}
          context="3 chambers currently active, 1 out"
          trend={{ text: 'Peak Hour', variant: 'warning' }}
          onClick={() => onTabChange('rooms')}
        />

        {/* Stat 4: Operations Alerts */}
        <StatCard
          label="Operations Alerts"
          value="2 Critical"
          context="Complications and failed credentials"
          alertPill={{
            text: '1 complication, 1 SMS delivery failure',
            linkLabel: 'View Details',
            onViewDetails: () => onTabChange('rooms'),
          }}
          onClick={() => onTabChange('rooms')}
        />
      </div>

      {/* Section C: 3-Column Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ActionCard
          icon={Users}
          title="Staff Management"
          description="Onboard doctors & therapists, audit medical credentials, and toggle status."
          footerStat={`${activeStaff} Active Staff`}
          actionLabel="Manage Directory"
          onClick={() => onTabChange('staff')}
        />

        <ActionCard
          icon={FileSpreadsheet}
          title="Therapy Protocols"
          description="Configure standard multi-stage blueprints for Virechana, enemas, and cleansing."
          footerStat={`${packages.length || 3} Active Blueprints`}
          actionLabel="View Protocols"
          onClick={() => onTabChange('protocols')}
        />

        <ActionCard
          icon={BedDouble}
          title="Rooms"
          description="Monitor therapy chambers and auto-scheduled treatment room occupancy."
          footerStat={`${availableRooms} Rooms Available`}
          actionLabel="View Rooms"
          onClick={() => onTabChange('rooms')}
        />
      </div>

      {/* Section D: Two-Column Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Clinical Activity Feed (8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                    <Activity className="w-5 h-5 text-ayur-primary" />
                    Clinical Activity Feed
                  </h3>
                  <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                    Real-time status updates across Doctors, Therapists, and Room assignments.
                  </p>
                </div>
                <Badge variant="ayur" size="sm">
                  Live Stream
                </Badge>
              </div>

              <div className="flex flex-col divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
                {activities.map((log, idx) => (
                  <ActivityFeedItem
                    key={log.id}
                    severity={log.severity}
                    message={log.action}
                    user={log.user}
                    role={log.role}
                    time={log.time}
                    isLast={idx === activities.length - 1}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: System Health Card (4 Cols) */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-ayur-green-mid" />
                  System Health
                </h3>
                <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                  Core integrations & operational telemetry.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {systemHealthItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-ayur-sand/60 flex items-center justify-center text-ayur-primary">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 font-serif">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            Operational service
                          </p>
                        </div>
                      </div>
                      <Badge variant={item.variant} size="sm">
                        {item.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Telemetry sync: Just now</span>
              <span className="text-ayur-primary font-bold">100% Uptime</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
