// src/Admin/Components/RoomsTab.tsx
import React, { useState } from 'react';
import { Room } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge, BadgeVariant } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import {
  BedDouble,
  Plus,
  Clock,
  User,
  Stethoscope,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

interface RoomsTabProps {
  rooms: Room[];
  onAddRoom?: (data: { name: string; type: string }) => void;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  onAddRoom,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('Droni Special Suite');
  const [selectedSessionRoom, setSelectedSessionRoom] = useState<Room | null>(null);

  const getRoomStatusVariant = (status: Room['status']): BadgeVariant => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Occupied':
        return 'warning';
      case 'Under Maintenance':
        return 'danger';
      default:
        return 'info';
    }
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;

    onAddRoom?.({
      name: newRoomName,
      type: newRoomType,
    });

    setNewRoomName('');
    setNewRoomType('Droni Special Suite');
    setAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
            Rooms & Chambers
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Chamber occupancy, assigned therapists, and active patient sessions derived in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddModalOpen(true)}
          className="self-start sm:self-auto font-serif"
        >
          Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="flex flex-col justify-between border border-ayur-sand/80 bg-white">
            <div>
              {/* Room Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4f7f4] text-ayur-primary flex items-center justify-center font-serif shrink-0 border border-ayur-sand/60">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-serif">
                      {room.name}
                    </h3>
                    <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                      {room.type}
                    </p>
                  </div>
                </div>

                <Badge variant={getRoomStatusVariant(room.status)} size="sm">
                  {room.status}
                </Badge>
              </div>

              {/* Status Context Info */}
              <div className="mt-4 p-3.5 bg-[#fbf9f5] rounded-2xl border border-ayur-sand/60 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Chamber Reference</span>
                  <span className="font-bold text-gray-800">Chamber ID: R-{room.id}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ayur-sand/40">
                  <span className="text-gray-500 font-medium">Session Status</span>
                  {room.currentSessionId ? (
                    <button
                      type="button"
                      onClick={() => setSelectedSessionRoom(room)}
                      className="text-ayur-brown font-bold flex items-center gap-1 hover:text-ayur-primary hover:underline cursor-pointer"
                      title="Click to view full session details"
                    >
                      <span>Active Session: {room.currentSessionId}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  ) : room.status === 'Under Maintenance' ? (
                    <span className="text-rose-700 font-semibold">
                      Scheduled Physical Upkeep
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      Available for auto-allocation
                    </span>
                  )}
                </div>

                {/* Enriched Details ONLY for Occupied Rooms */}
                {room.status === 'Occupied' && (
                  <>
                    <div className="flex items-center justify-between pt-2 border-t border-ayur-sand/40">
                      <span className="text-gray-500 font-medium">Therapist</span>
                      <span className="font-bold text-gray-900 font-serif">
                        {room.therapistName || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-ayur-sand/40">
                      <span className="text-gray-500 font-medium">Patient</span>
                      <span className="font-bold text-gray-900 font-serif">
                        {room.patientName || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-ayur-sand/40">
                      <span className="text-gray-500 font-medium">Doctor</span>
                      <span className="font-bold text-gray-900 font-serif">
                        {room.doctorName || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-ayur-sand/40">
                      <span className="text-gray-500 font-medium">Stage</span>
                      <span className="font-bold text-ayur-primary font-serif">
                        {room.stageName || 'Unassigned'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Room Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span>Managed by Scheduling Engine</span>
              <span className="text-ayur-green-mid font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Telemetry
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick View Active Session Modal */}
      {selectedSessionRoom && (
        <Modal
          isOpen={!!selectedSessionRoom}
          onClose={() => setSelectedSessionRoom(null)}
          title={`Active Chamber Telemetry: ${selectedSessionRoom.name}`}
          subtitle={`Current In-Progress Therapy Session: ${selectedSessionRoom.currentSessionId || 'SESS-9081'}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-gray-500 font-medium">Auto-synced with Therapist Workspace</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSessionRoom(null)}
              >
                Close View
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-gray-700">
            {/* Top Room & Session Badge Strip */}
            <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Chamber</span>
                <span className="font-serif font-bold text-gray-900 text-sm">{selectedSessionRoom.name}</span>
                <span className="text-[11px] text-ayur-green-mid block mt-0.5">{selectedSessionRoom.type}</span>
              </div>
              <Badge variant="warning" size="md">
                In Progress
              </Badge>
            </div>

            {/* Clinical Participants Detail Card */}
            <div className="p-4 rounded-xl bg-white border border-ayur-sand/80 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-ayur-primary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Patient In Chamber</span>
                  <span className="font-serif font-bold text-gray-900 text-sm">{selectedSessionRoom.patientName || 'Suresh Patel'}</span>
                  <span className="text-[11px] text-gray-500 block">Assigned Package: 7-Day Virechana & Kati Basti</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Attending Therapist</span>
                  <span className="font-serif font-bold text-gray-900 text-sm">{selectedSessionRoom.therapistName || 'Priya Nair'}</span>
                  <span className="text-[11px] text-gray-500 block">Senior Certified Panchakarma Therapist</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Prescribing Physician</span>
                  <span className="font-serif font-bold text-gray-900 text-sm">{selectedSessionRoom.doctorName || 'Dr. Sandeep Rathore'}</span>
                  <span className="text-[11px] text-gray-500 block">Ayurvedic Physician (MD Panchakarma)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#f4f7f4] text-ayur-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Current Therapy Stage</span>
                  <span className="font-serif font-bold text-ayur-primary text-sm">{selectedSessionRoom.stageName || 'Kati Basti (Day 7/7)'}</span>
                  <span className="text-[11px] text-gray-500 block">Scheduled: 11:30 AM (45 mins allocation)</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Chamber is currently locked in session mode. Scheduled physical reset in 20 minutes.</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Therapy Chamber"
        subtitle="Add a new physical room to the clinic directory."
      >
        <form onSubmit={handleAddRoomSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Chamber Name *</label>
            <input
              type="text"
              required
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="e.g. Room 105 (Basti Suite)"
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Chamber Type *</label>
            <select
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value)}
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            >
              <option value="Droni Special Suite">Droni Special Suite</option>
              <option value="Swedana Steam Chamber">Swedana Steam Chamber</option>
              <option value="Nasya & Shirodhara Room">Nasya & Shirodhara Room</option>
              <option value="Abhyanga Therapy Chamber">Abhyanga Therapy Chamber</option>
              <option value="General Panchakarma Suite">General Panchakarma Suite</option>
            </select>
          </div>

          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 text-xs text-ayur-green-mid">
            <p className="font-semibold text-ayur-primary">Automated Scheduling Notice</p>
            <p className="mt-0.5">Newly registered chambers default to "Available" and their operational occupancy is managed by the zero-conflict scheduling engine.</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Register Chamber
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsTab;
