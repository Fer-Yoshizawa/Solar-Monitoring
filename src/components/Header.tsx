import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { LayoutDashboard, ListFilter, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, isMonitorActive, toggleMonitor } = useTelemetry();
  const [imgError, setImgError] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141724]/95 backdrop-blur-md border-b border-[#3b4460]/70 h-16 select-none transition-colors">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone - Clean typography, zero heavy pill boxes */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink min-w-0">
          {!imgError ? (
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1XiKjcOMNr154NLpBQVptaAq6B-PuQBU9HHiJQNHY5CrI69q-38nLlwshMxnYwnYl5EMXkUud_k2-WYWtVXB4S2C_5N1Fy3g8hf8FthVzox3YmJdOIXlpEcbe77C9gNvEYx936EUEgxGv8VhdIRyWg5YYGLmYkJqbziHKJJqfqBrpa9WhWGHGSLN7jyUMvUiMOB0qRwziCs78VHkAYCXG3Yk3zKS9DNaQRayS4B7Yx0C_sKdpA20afGJFE"
              alt="Solar Monitor Logo"
              className="h-7 sm:h-8 w-auto object-contain shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#181b29] border border-[#3b4460] flex items-center justify-center text-[#fab387] shrink-0">
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-lg text-[#dce3f7] tracking-tight whitespace-nowrap">
                Solar Monitor
              </span>
              <span className="text-[#9aa3c2] hidden sm:inline text-xs">·</span>
              <span className="text-xs text-[#9aa3c2] hidden sm:inline whitespace-nowrap">
                Science Center Microgrid
              </span>
            </div>
          </div>

          {/* Genuine Live Streaming Indicator (Only active pulse dot when stream is real-time) */}
          <div className="flex items-center gap-1.5 text-xs text-[#9aa3c2] shrink-0 ml-1">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isMonitorActive ? 'bg-[#a6e3a1] animate-pulse shadow-[0_0_8px_rgba(166,227,161,0.6)]' : 'bg-[#9aa3c2]/60'
              }`}
            />
            <span className="text-[11px] sm:text-xs font-medium tracking-wide">
              {isMonitorActive ? 'Live' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation Zone */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Navigation Tabs - Clean Segmented Control */}
          <nav className="flex items-center gap-1 bg-[#0f111a] p-1 rounded-lg border border-[#3b4460]/80 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('console')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeView === 'console'
                  ? 'bg-[#272d40] text-[#dce3f7] shadow-sm font-semibold'
                  : 'text-[#9aa3c2] hover:text-[#dce3f7]'
              }`}
              title="Switch to Power Console View"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#fab387] shrink-0" />
              <span>Console</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('telemetry-log')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeView === 'telemetry-log'
                  ? 'bg-[#272d40] text-[#dce3f7] shadow-sm font-semibold'
                  : 'text-[#9aa3c2] hover:text-[#dce3f7]'
              }`}
              title="Switch to Telemetry Activity Log"
            >
              <ListFilter className="w-3.5 h-3.5 text-[#fab387] shrink-0" />
              <span className="hidden md:inline">Telemetry Log</span>
              <span className="md:hidden">Log</span>
            </button>
          </nav>

          {/* Master Live Monitor Switch */}
          <div className="flex items-center gap-2 border-l border-[#3b4460]/60 pl-2 sm:pl-4 shrink-0">
            <span className="text-xs font-medium text-[#9aa3c2] hidden md:inline">
              Stream:
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isMonitorActive}
              onClick={toggleMonitor}
              title={isMonitorActive ? "Pause telemetry data sampling" : "Resume live telemetry data sampling"}
              className={`relative inline-flex h-5.5 w-10 sm:h-6 sm:w-11 items-center shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#fab387] focus:ring-offset-2 focus:ring-offset-[#141724] ${
                isMonitorActive ? 'bg-[#212638] border border-[#a6e3a1]/60' : 'bg-[#141724] border border-[#3b4460]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isMonitorActive ? 'translate-x-4.5 sm:translate-x-5 bg-[#a6e3a1]' : 'translate-x-0.5 bg-[#9aa3c2]'
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold select-none ${
                isMonitorActive ? 'text-[#a6e3a1]' : 'text-[#9aa3c2]'
              }`}
            >
              {isMonitorActive ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
