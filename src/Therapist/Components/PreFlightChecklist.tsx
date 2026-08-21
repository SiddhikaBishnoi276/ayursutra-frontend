// src/Therapist/Components/PreFlightChecklist.tsx
import React from 'react';
import {
  CheckCircle2,
  XCircle,
  PackageCheck,
  PackageX,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { TherapistSession, PreFlightChecklistState } from '../types/therapist.types';

export interface PreFlightChecklistProps {
  session: TherapistSession;
  checklist: PreFlightChecklistState;
  onToggleCheck: (key: keyof PreFlightChecklistState) => void;
  onSetAllChecks: (val: boolean) => void;
  hasInventoryShortage: boolean;
  shortages?: any[];
  className?: string;
}

export const PreFlightChecklist: React.FC<PreFlightChecklistProps> = ({
  session,
  checklist,
  onToggleCheck,
  onSetAllChecks,
  hasInventoryShortage,
  shortages = [],
  className = '',
}) => {
  return (
    <Card className={`flex flex-col gap-6 border border-ayur-sand/80 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 font-serif flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-ayur-primary" />
            Pre-Flight Clinical & Safety Checklist
          </h3>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Mandatory protocol verification prior to chamber entry and live session timer ignition.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSetAllChecks(true)}
          className="text-xs font-serif"
          disabled={hasInventoryShortage}
        >
          Check All Ready
        </Button>
      </div>

      {/* Inventory Status Alert if Shortage */}
      {hasInventoryShortage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
          <PackageX className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold font-serif text-rose-950 text-sm">
                CRITICAL INVENTORY SHORTAGE DETECTED
              </span>
              <Badge variant="danger" size="sm">
                Action Required
              </Badge>
            </div>
            <p className="mt-1 text-rose-800 leading-relaxed font-medium">
              Chamber stock for required stage formulation is below safety threshold. Session start is locked until restocked.
            </p>
            <div className="mt-2 space-y-1 bg-white/80 p-2.5 rounded-xl border border-rose-100">
              {shortages.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-800">{m.name}</span>
                  <span className="text-rose-700 font-bold">
                    Stock: {m.inStock} {m.unit} (Needed: {m.quantityRequired}, Threshold: {m.threshold} {m.unit})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Verification Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item 1: Chamber & Room Readiness */}
        <div
          onClick={() => onToggleCheck('roomReady')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            checklist.roomReady
              ? 'bg-emerald-50/50 border-emerald-300/80 shadow-2xs'
              : 'bg-white border-ayur-sand/70 hover:border-gray-300'
          }`}
        >
          <div className="mt-0.5 text-ayur-primary shrink-0">
            {checklist.roomReady ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-gray-900 text-sm">
                Chamber Environment & Temperature
              </span>
              <Badge variant={checklist.roomReady ? 'success' : 'warning'} size="sm">
                {checklist.roomReady ? 'Prepared' : 'Unchecked'}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Chamber {session.roomNumber} ventilated, temperature regulated (24°C–26°C), sanitized linens placed.
            </p>
          </div>
        </div>

        {/* Item 2: Equipment Sanitization */}
        <div
          onClick={() => onToggleCheck('equipmentSanitized')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            checklist.equipmentSanitized
              ? 'bg-emerald-50/50 border-emerald-300/80 shadow-2xs'
              : 'bg-white border-ayur-sand/70 hover:border-gray-300'
          }`}
        >
          <div className="mt-0.5 text-ayur-primary shrink-0">
            {checklist.equipmentSanitized ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-gray-900 text-sm">
                Apparatus & Vessel Sanitization
              </span>
              <Badge variant={checklist.equipmentSanitized ? 'success' : 'warning'} size="sm">
                {checklist.equipmentSanitized ? 'Sterile' : 'Unchecked'}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Droni table wiped, Swedana steam box flushed, Kati ring dough / Shirodhara vessel sterile.
            </p>
          </div>
        </div>

        {/* Item 3: Materials & Formulations */}
        <div
          onClick={() => {
            if (!hasInventoryShortage) onToggleCheck('materialsVerified');
          }}
          className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
            hasInventoryShortage
              ? 'bg-rose-50/30 border-rose-200 cursor-not-allowed opacity-80'
              : checklist.materialsVerified
              ? 'bg-emerald-50/50 border-emerald-300/80 shadow-2xs cursor-pointer'
              : 'bg-white border-ayur-sand/70 hover:border-gray-300 cursor-pointer'
          }`}
        >
          <div className="mt-0.5 text-ayur-primary shrink-0">
            {checklist.materialsVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : hasInventoryShortage ? (
              <PackageX className="w-5 h-5 text-rose-500" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-gray-900 text-sm">
                Herbal Formulations & Oils
              </span>
              <Badge
                variant={hasInventoryShortage ? 'danger' : checklist.materialsVerified ? 'success' : 'warning'}
                size="sm"
              >
                {hasInventoryShortage ? 'Shortage' : checklist.materialsVerified ? 'Ready' : 'Pending'}
              </Badge>
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1 space-y-0.5">
              {session.materials.map((m) => (
                <div key={m.id} className="flex justify-between">
                  <span>• {m.name}</span>
                  <span className="font-bold text-ayur-primary">{m.quantityRequired}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Item 4: Patient Identity & Consent Confirmation */}
        <div
          onClick={() => onToggleCheck('patientIdentified')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            checklist.patientIdentified
              ? 'bg-emerald-50/50 border-emerald-300/80 shadow-2xs'
              : 'bg-white border-ayur-sand/70 hover:border-gray-300'
          }`}
        >
          <div className="mt-0.5 text-ayur-primary shrink-0">
            {checklist.patientIdentified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-gray-900 text-sm">
                Patient Identity & Vitals Cross-Check
              </span>
              <Badge variant={checklist.patientIdentified ? 'success' : 'warning'} size="sm">
                {checklist.patientIdentified ? 'Verified' : 'Unchecked'}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Confirmed ID: <strong>{session.patientId}</strong> ({session.patientName}, {session.patientGender}). Pulse & baseline checked.
            </p>
          </div>
        </div>
      </div>

      {/* Item 5: Allergy & Precautions Acknowledged */}
      <div
        onClick={() => onToggleCheck('allergyConfirmed')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
          checklist.allergyConfirmed
            ? 'bg-emerald-50/50 border-emerald-300/80'
            : 'bg-white border-ayur-sand/70 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {checklist.allergyConfirmed ? (
            <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-gray-800">
            I confirm that I have reviewed patient contraindications, sensitivities, and prior session reactions.
          </span>
        </div>
        <Badge variant={checklist.allergyConfirmed ? 'success' : 'info'} size="sm">
          {checklist.allergyConfirmed ? 'Acknowledged' : 'Required'}
        </Badge>
      </div>
    </Card>
  );
};

export default PreFlightChecklist;
