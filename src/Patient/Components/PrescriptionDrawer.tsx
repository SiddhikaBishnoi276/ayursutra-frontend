// src/Patient/Components/PrescriptionDrawer.tsx
// Modal/Drawer for viewing prescribed herbal medicines, dosages, timings, and intake vehicles (Anupana)

import React from 'react';

import { Modal } from '../../Common/Components/Modal';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { PrescriptionData } from '../types/patient.types';
import { formatDate } from '../Services/patientService';

export interface PrescriptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: PrescriptionData | null;
}

export const PrescriptionDrawer: React.FC<PrescriptionDrawerProps> = ({
  isOpen,
  onClose,
  prescription,
}) => {
  if (!prescription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ayurvedic Prescriptions & Medications"
      subtitle={`Issued by ${prescription.doctorName} • Valid till ${formatDate(prescription.validTill)}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-gray-500 font-medium">
            Take all formulations strictly with prescribed Anupana (warm water/milk).
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Prescription Header Info */}
        <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-500 font-medium block text-[11px]">Prescribed For:</span>
            <span className="font-bold text-gray-900 font-serif text-sm">
              {prescription.patientName}
            </span>
          </div>
          <div>
            <span className="text-gray-500 font-medium block text-[11px]">Issued Date:</span>
            <span className="font-bold text-gray-900">
              {formatDate(prescription.issuedDate)}
            </span>
          </div>
          <div>
            <Badge variant="ayur" size="sm">
              Active Prescription
            </Badge>
          </div>
        </div>

        {/* Medicines List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
            Prescribed Formulations ({prescription.medications.length})
          </h4>

          <div className="space-y-3">
            {prescription.medications.map((med) => (
              <div
                key={med.id}
                className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs hover:border-ayur-green-mid/40 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-gray-900 font-serif">
                        {med.name}
                      </h5>
                      {med.sanskritName && (
                        <span className="text-xs text-ayur-brown font-medium">
                          ({med.sanskritName})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Dosage: <strong className="text-gray-800">{med.dosage}</strong>
                    </span>
                  </div>

                  <Badge variant="ayur" size="sm">
                    {med.timing}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2.5 text-xs text-gray-700">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      Frequency:
                    </span>
                    <span className="font-semibold">{med.frequency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      Duration:
                    </span>
                    <span className="font-semibold">{med.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      Vehicle (Anupana):
                    </span>
                    <span className="font-semibold text-purple-700">{med.anupana || 'Warm Water'}</span>
                  </div>
                </div>

                {med.instructions && (
                  <p className="text-[11px] text-gray-600 font-medium mt-2 pt-2 border-t border-stone-100">
                    <strong>Instructions: </strong> {med.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* General Precautions */}
        {prescription.generalPrecautions && prescription.generalPrecautions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
            <span className="font-bold text-amber-950 font-serif block mb-1">
              General Clinical Precautions:
            </span>
            <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5 font-medium">
              {prescription.generalPrecautions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PrescriptionDrawer;
