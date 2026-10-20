import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Check, LayoutDashboard, ListFilter } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    activeView,
    setActiveView,
    totalAllocated,
    targetBudgetCap,
    remainingReserve,
    isMonitorActive,
    toastMessage,
  } = useTelemetry();

  return (
    <>
      {/* Standard Desktop / Tablet Humanized Footer */}
      <footer className="w-full bg-[#0f111a] border-t border-[#3b4460]/60 py-4 text-xs text-[#9aa3c2] select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#dce3f7]">Solar Monitor</span>
            <span>·</span>
            <span>Science Building Clean Energy Management</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isMonitorActive ? 'bg-[#a6e3a1]' : 'bg-[#9aa3c2]'
                }`}
              />
              <span>{isMonitorActive ? 'Live Telemetry Active' : 'Sampling Paused'}</span>
            </span>
            <span>·</span>
            <span>Rooftop Solar & Battery Storage</span>
          </div>
        </div>
      </footer>

      {/* Persistent Mobile Sticky Allocation & Action Bar (<640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141724]/95 backdrop-blur-md border-t border-[#3b4460] px-4 py-2 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-[#9aa3c2]">
            {activeView === 'console' ? 'Allocated Power Demand' : 'Stream Activity'}
          </span>
          <span className="text-xs font-bold text-[#dce3f7] tabular-nums">
            {activeView === 'console' ? (
              <>
                {totalAllocated.toFixed(1)} / {targetBudgetCap.toFixed(1)} kW{' '}
                <span className={remainingReserve >= 0 ? 'text-[#a6e3a1]' : 'text-[#f38ba8]'}>
                  ({remainingReserve >= 0 ? `+${remainingReserve.toFixed(1)} kW` : `${remainingReserve.toFixed(1)} kW`})
                </span>
              </>
            ) : (
              <span className="text-[#a6e3a1]">4,096 Records · Synchronized</span>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActiveView(activeView === 'console' ? 'telemetry-log' : 'console')}
          className="px-3 py-1.5 rounded-lg bg-[#272d40] border border-[#3b4460] text-[#fab387] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          {activeView === 'console' ? (
            <>
              <ListFilter className="w-3.5 h-3.5" />
              <span>Activity Log</span>
            </>
          ) : (
            <>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Console</span>
            </>
          )}
        </button>
      </div>

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-14 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#181b29] border border-[#fab387] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-[#dce3f7] text-xs sm:text-sm">
            <Check className="w-4 h-4 text-[#fab387] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
