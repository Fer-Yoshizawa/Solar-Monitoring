import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { CircuitPriority } from '../types/telemetry';
import { X, Plus, ShieldCheck } from 'lucide-react';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose }) => {
  const { addCircuit, remainingReserve } = useTelemetry();
  const [name, setName] = useState('');
  const [allocatedKw, setAllocatedKw] = useState('0.8');
  const [type, setType] = useState<CircuitPriority>('Standard');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const kw = parseFloat(allocatedKw) || 0.5;

    addCircuit({
      name: name.trim(),
      type,
      allocatedKw: Math.max(0, Math.round(kw * 10) / 10),
      isActive: true,
      connected: true,
    });

    setName('');
    setAllocatedKw('0.8');
    setType('Standard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0c14]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#181b29] border border-[#3b4460] rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#0f111a] border-b border-[#3b4460]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#fab387]" />
            <h3 className="font-semibold text-base text-[#dce3f7]">Add Facility Circuit</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9aa3c2] hover:text-[#dce3f7] p-1 rounded-md hover:bg-[#272d40] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#9aa3c2] mb-1.5">
              Room or Equipment Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Biology Incubator, Optics Bench, Room 204..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f111a] border border-[#3b4460] rounded-lg text-[#dce3f7] placeholder-[#9aa3c2]/40 focus:outline-none focus:border-[#fab387]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#9aa3c2]">
                Initial Power Allocation (kW)
              </label>
              <span className="text-xs text-[#9aa3c2]">
                Available Reserve: <strong className="text-[#a6e3a1] tabular-nums">{remainingReserve.toFixed(1)} kW</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={allocatedKw}
                onChange={(e) => setAllocatedKw(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f111a] border border-[#3b4460] rounded-lg text-[#dce3f7] font-semibold tabular-nums focus:outline-none focus:border-[#fab387]"
              />
              <span className="px-3 py-2 bg-[#0f111a] border border-[#3b4460] rounded-lg text-[#9aa3c2] font-semibold">
                kW
              </span>
            </div>

            {/* Presets */}
            <div className="flex gap-1.5 mt-2">
              {[0.5, 0.8, 1.2, 1.8].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAllocatedKw(preset.toString())}
                  className="px-2.5 py-1 rounded-md bg-[#272d40] border border-[#3b4460] text-xs text-[#9aa3c2] hover:text-[#dce3f7] hover:border-[#fab387] transition-colors cursor-pointer"
                >
                  +{preset} kW
                </button>
              ))}
            </div>
          </div>

          {/* Priority Flag */}
          <div>
            <label className="block text-xs font-semibold text-[#9aa3c2] mb-1.5">
              Circuit Protection Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Standard')}
                className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  type === 'Standard'
                    ? 'bg-[#272d40] border-[#dce3f7] text-[#dce3f7]'
                    : 'bg-[#0f111a] border-[#3b4460] text-[#9aa3c2] hover:text-[#dce3f7]'
                }`}
              >
                Standard Circuit
              </button>

              <button
                type="button"
                onClick={() => setType('Priority')}
                className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  type === 'Priority'
                    ? 'bg-[#f9e2af]/15 border-[#f9e2af] text-[#f9e2af]'
                    : 'bg-[#0f111a] border-[#3b4460] text-[#9aa3c2] hover:text-[#dce3f7]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Priority (No Shed)
              </button>
            </div>
            <p className="text-[11px] text-[#9aa3c2] mt-1.5">
              Priority circuits are protected from automated load-shedding if facility power demand exceeds solar limits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#3b4460]/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#272d40] border border-[#3b4460] text-xs font-medium text-[#9aa3c2] hover:text-[#dce3f7] hover:bg-[#323a52] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#fab387]/15 border border-[#fab387] text-[#fab387] hover:bg-[#fab387]/25 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Circuit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
