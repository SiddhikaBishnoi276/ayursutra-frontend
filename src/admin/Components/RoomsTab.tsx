import React, { useState } from 'react';
import { Room } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge, BadgeVariant } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { BedDouble, Plus, Sparkles } from 'lucide-react';

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
            Chamber occupancy and availability derived in real-time from the Panchakarma scheduling engine.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="flex flex-col justify-between">
            <div>
              {/* Room Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f4f7f4] text-ayur-primary flex items-center justify-center font-serif shrink-0">
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
              <div className="mt-4 p-3.5 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Chamber Reference</span>
                  <span className="font-bold text-gray-800">Chamber ID: R-{room.id}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-ayur-sand/40">
                  <span className="text-gray-500 font-medium">Session Status</span>
                  {room.currentSessionId ? (
                    <span className="text-ayur-brown font-bold flex items-center gap-1">
                      Active Session: {room.currentSessionId}
                    </span>
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
              </div>
            </div>

            {/* Room Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span>Managed by Scheduling Engine</span>
              <span className="text-ayur-green-mid font-semibold">Live Telemetry</span>
            </div>
          </Card>
        ))}
      </div>

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
