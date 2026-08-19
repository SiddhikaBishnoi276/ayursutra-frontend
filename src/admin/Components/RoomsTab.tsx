import { useState } from 'react';
import { Room, RoomEquipment } from '../types/admin.types';
import { 
    AlertCircle, 
    CheckCircle2, 
    ShieldAlert, 
    Wrench, 
    Plus, 
    X,
    ClipboardList,
    AlertTriangle,
    Trash2,
    Save
} from 'lucide-react';

interface RoomsTabProps {
    rooms: Room[];
    onSetRoomStatus: (id: string, status: Room['status']) => { success: boolean; error?: string };
    onAddRoom: (room: Omit<Room, 'id'>) => void;
}

export const RoomsTab = ({ rooms, onSetRoomStatus, onAddRoom }: RoomsTabProps) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    
    // Add Room Modal State
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('Droni Room');
    const [customRoomType, setCustomRoomType] = useState('');
    const [equipmentList, setEquipmentList] = useState<Omit<RoomEquipment, 'id'>[]>([
        { name: 'Neem-wood Droni table', status: 'Operational' }
    ]);
    const [newEquipName, setNewEquipName] = useState('');
    const [newEquipStatus, setNewEquipStatus] = useState<'Operational' | 'Requires Service'>('Operational');

    // Warning / Block Modal State
    const [conflictModalOpen, setConflictModalOpen] = useState(false);
    const [conflictMessage, setConflictMessage] = useState('');
    const [pendingRoom, setPendingRoom] = useState<Room | null>(null);

    // Toast State
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSetStatus = (room: Room, status: Room['status']) => {
        // If room is occupied, check if trying to set to maintenance
        if (status === 'Under Maintenance') {
            const result = onSetRoomStatus(room.id, status);
            if (!result.success) {
                setPendingRoom(room);
                setConflictMessage(result.error || '');
                setConflictModalOpen(true);
                return;
            }
        } else {
            onSetRoomStatus(room.id, status);
        }
        showToast(`Chamber status updated to ${status}.`);
    };

    const handleAddEquipment = () => {
        if (!newEquipName) return;
        setEquipmentList(prev => [...prev, { name: newEquipName, status: newEquipStatus }]);
        setNewEquipName('');
    };

    const handleRemoveEquipment = (index: number) => {
        setEquipmentList(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName) {
            alert('Please specify a chamber name.');
            return;
        }

        const type = roomType === 'Custom' ? customRoomType : roomType;
        const equipmentWithIds = equipmentList.map((eq, idx) => ({
            ...eq,
            id: `EQ-${Date.now()}-${idx}`
        }));

        onAddRoom({
            name: roomName,
            type,
            status: 'Available',
            equipment: equipmentWithIds
        });

        // Reset
        setRoomName('');
        setRoomType('Droni Room');
        setCustomRoomType('');
        setEquipmentList([{ name: 'Neem-wood Droni table', status: 'Operational' }]);
        setAddModalOpen(false);
        showToast('New therapy chamber registered successfully.');
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Chamber & Infrastructure Matrix</h2>
                    <p className="text-sm text-slate-500">Monitor sanitization status, inspect Ayurvedic Droni tables, and manage equipment availability.</p>
                </div>
                
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 shadow-sm transition"
                    title="Add a new therapy room or steam chamber"
                    tabIndex={0}
                >
                    <Plus className="h-4.5 w-4.5" />
                    Add Chamber
                </button>
            </div>

            {/* Grid list of rooms */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => {
                    let statusBg = '';
                    let statusText = '';
                    let statusIcon = null;

                    if (room.status === 'Available') {
                        statusBg = 'bg-emerald-50 border-emerald-250 text-emerald-850';
                        statusText = 'Available';
                        statusIcon = <CheckCircle2 className="h-4 w-4 text-emerald-700" />;
                    } else if (room.status === 'Occupied') {
                        statusBg = 'bg-amber-50 border-amber-250 text-amber-850';
                        statusText = 'Session Active';
                        statusIcon = <AlertCircle className="h-4 w-4 text-amber-700" />;
                    } else {
                        statusBg = 'bg-slate-50 border-slate-200 text-slate-600';
                        statusText = 'Sanitization';
                        statusIcon = <ShieldAlert className="h-4 w-4 text-slate-500" />;
                    }

                    return (
                        <div 
                            key={room.id}
                            className={`rounded-2xl border p-5 shadow-2xs flex flex-col justify-between gap-5 bg-white transition duration-300 hover:shadow-md ${
                                room.status === 'Under Maintenance' ? 'border-slate-250 bg-slate-50/20' : 'border-slate-100'
                            }`}
                        >
                            {/* Room info */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base">{room.name}</h3>
                                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{room.type}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBg}`}>
                                        {statusIcon}
                                        {statusText}
                                    </span>
                                </div>

                                {/* Equipment mini-list */}
                                <div className="mt-4 border-t border-slate-50 pt-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <ClipboardList className="h-3.5 w-3.5" />
                                        Equipment Inventory ({room.equipment.length})
                                    </h4>
                                    <div className="mt-2 flex flex-col gap-1.5">
                                        {room.equipment.map((eq) => (
                                            <div key={eq.id} className="flex items-center justify-between text-xs font-semibold text-slate-650">
                                                <span>{eq.name}</span>
                                                {eq.status === 'Operational' ? (
                                                    <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Operational</span>
                                                ) : (
                                                    <span className="text-[9px] text-red-800 font-bold bg-red-50 px-1.5 py-0.2 rounded border border-red-200/50">Requires Service</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions bar */}
                            <div className="border-t border-slate-50 pt-3.5 flex items-center justify-between gap-2.5">
                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    title={`Inspect details for ${room.name}`}
                                    tabIndex={0}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline transition focus:outline-none focus:ring-1 focus:ring-emerald-800 rounded"
                                >
                                    Inspect Chamber
                                </button>
                                
                                <div className="flex gap-2">
                                    {room.status !== 'Available' && (
                                        <button
                                            onClick={() => handleSetStatus(room, 'Available')}
                                            title="Mark chamber status as Available"
                                            tabIndex={0}
                                            className="rounded-lg bg-emerald-50 border border-emerald-250 px-2.5 py-1.5 text-[11px] font-bold text-emerald-850 hover:bg-emerald-100 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                                        >
                                            Set Available
                                        </button>
                                    )}
                                    {room.status !== 'Under Maintenance' && (
                                        <button
                                            onClick={() => handleSetStatus(room, 'Under Maintenance')}
                                            title="Mark chamber status as Under Maintenance"
                                            tabIndex={0}
                                            className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-650 hover:bg-slate-200 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                        >
                                            <Wrench className="h-3 w-3" strokeWidth={2.5} />
                                            Maintenance
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Room Inspection Side-drawer/Modal */}
            {selectedRoom && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-850">{selectedRoom.name} Inspection Log</h3>
                            <button 
                                onClick={() => setSelectedRoom(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition"
                                title="Close Inspection log"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 text-xs font-semibold">
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Chamber Type:</span>
                                <span className="text-slate-700">{selectedRoom.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Availability Status:</span>
                                <span className="text-slate-700 font-bold">{selectedRoom.status}</span>
                            </div>
                            {selectedRoom.currentSessionId && (
                                <div className="flex justify-between animate-pulse">
                                    <span className="text-slate-400 font-medium">Active Session Code:</span>
                                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono border border-amber-200/50">{selectedRoom.currentSessionId}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <h4 className="font-bold text-slate-750 text-xs">Sanitization History & Notes</h4>
                            <p className="mt-1.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                                Chamber is steam-sterilized using neem and camphor extracts after every Abhyanga massage. Wooden Droni tables are rubbed with herbal oil weekly to protect joint alignments.
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedRoom(null)}
                            className="w-full rounded-lg bg-emerald-900 py-2 text-xs font-bold text-white hover:bg-emerald-950 transition mt-2"
                        >
                            Close Log
                        </button>
                    </div>
                </div>
            )}

            {/* "+ Add Room" Slide-over Drawer */}
            {addModalOpen && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between overflow-y-auto border-l border-slate-200">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-850">Register New Chamber</h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Define new clinic therapy infrastructure.</p>
                                </div>
                                <button 
                                    onClick={() => setAddModalOpen(false)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition"
                                    title="Close Add Chamber Drawer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form id="add-room-form" onSubmit={handleFormSubmit} className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Chamber / Room Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Droni Room 3"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Chamber Type *</label>
                                    <select
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none"
                                    >
                                        <option value="Droni Room">Droni Room (Abhyanga / Elakizhi)</option>
                                        <option value="Steam Chamber">Steam Chamber (Swedana)</option>
                                        <option value="Basti Room">Basti Room (Enema setups)</option>
                                        <option value="General Therapy Room">General Therapy Room</option>
                                        <option value="Custom">Custom Type</option>
                                    </select>
                                </div>

                                {roomType === 'Custom' && (
                                    <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
                                        <label className="text-slate-500">Custom Chamber Type *</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="e.g. Shirodhara Hub"
                                            value={customRoomType}
                                            onChange={(e) => setCustomRoomType(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                        />
                                    </div>
                                )}

                                {/* Equipment repeatable list */}
                                <div className="border-t border-slate-100 pt-3">
                                    <label className="text-slate-500 uppercase tracking-widest text-[9px] font-bold">Chamber Equipment Assets</label>
                                    
                                    <div className="mt-2 flex flex-col gap-2">
                                        {equipmentList.map((eq, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-705">{eq.name}</p>
                                                    <span className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">{eq.status}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveEquipment(idx)}
                                                    className="rounded p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 transition"
                                                    title="Remove asset"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add equipment row */}
                                    <div className="mt-3 flex gap-2 items-end bg-slate-50/50 p-2.5 rounded-lg border border-dashed border-slate-200">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="text-[9px] text-slate-450 font-bold">Asset Name</span>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Shirodhara Stand"
                                                value={newEquipName}
                                                onChange={(e) => setNewEquipName(e.target.value)}
                                                className="rounded border border-slate-200 bg-white px-2 py-1 outline-none font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] text-slate-450 font-bold">Condition</span>
                                            <select
                                                value={newEquipStatus}
                                                onChange={(e) => setNewEquipStatus(e.target.value as any)}
                                                className="rounded border border-slate-200 bg-white px-2 py-1 outline-none"
                                            >
                                                <option value="Operational">Operational</option>
                                                <option value="Requires Service">Requires Service</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddEquipment}
                                            className="rounded bg-slate-900 text-white px-3 py-1 font-bold hover:bg-slate-950 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex gap-3 border-t border-slate-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setAddModalOpen(false)}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="add-room-form"
                                className="flex-1 rounded-lg bg-emerald-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-950 transition flex items-center justify-center gap-1.5"
                            >
                                <Save className="h-4 w-4" />
                                Register Chamber
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blocking Booking Conflict Warning Modal (No bypass option) */}
            {conflictModalOpen && pendingRoom && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-red-750">
                            <div className="rounded-full bg-red-50 p-2 border border-red-200">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h4 className="text-base font-extrabold text-slate-850">Blocked Action: Chamber Active</h4>
                        </div>
                        
                        <div className="text-xs font-semibold text-slate-600 leading-relaxed flex flex-col gap-2">
                            <p className="text-red-750 font-bold bg-red-50 p-3 rounded-lg border border-red-200/50">
                                ⚠️ Blocked: {conflictMessage}
                            </p>
                            <p>
                                {pendingRoom.name} has active enema or detoxification procedures currently scheduled. You must reschedule these sessions or wait for their completion before marking this room under maintenance.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => {
                                    setConflictModalOpen(false);
                                    setPendingRoom(null);
                                }}
                                className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-950 transition"
                            >
                                Close Conflict Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Alerts */}
            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

        </div>
    );
};
