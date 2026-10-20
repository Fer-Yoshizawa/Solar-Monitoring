import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';

interface CalibrationStripProps {
  variant: 'console' | 'telemetry-log';
}

export const CalibrationStrip: React.FC<CalibrationStripProps> = ({ variant }) => {
  const { isMonitorActive, systemMetrics } = useTelemetry();
  const [clockString, setClockString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
      setClockString(`${hours}:${minutes}:${seconds}.${ms} UTC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'console') {
    return (
      <div className="w-full bg-[#0f111a] border-b border-[#3b4460]/60 px-3 sm:px-6 lg:px-8 py-2 text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[#9aa3c2]">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-[#dce3f7]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isMonitorActive ? 'bg-[#a6e3a1]' : 'bg-[#f9e2af]'
                }`}
              />
              <span>{isMonitorActive ? 'Microgrid Operational' : 'Monitoring Standby'}</span>
            </span>

            <span className="text-[#3b4460] hidden sm:inline">·</span>

            <div className="flex items-center gap-1">
              <span>Main Inverter Output:</span>
              <span className="font-semibold text-[#dce3f7] tabular-nums">
                {isMonitorActive ? `${systemMetrics.busVoltage.toFixed(1)} V DC` : 'Standby'}
              </span>
            </div>

            <span className="text-[#3b4460] hidden md:inline">·</span>

            <div className="hidden md:flex items-center gap-1">
              <span>Sampling:</span>
              <span className="text-[#dce3f7] font-medium">1 update/second</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
            <span className="text-[#9aa3c2]">Rooftop Arrays A & B Calibrated</span>
            <span className="text-[#3b4460] hidden sm:inline">·</span>
            <span className="text-[#fab387] font-mono text-[11px] tabular-nums">
              {clockString.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Telemetry Log Variant
  return (
    <div className="w-full bg-[#0f111a] border-b border-[#3b4460]/60 px-3 sm:px-6 lg:px-8 py-2 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[#9aa3c2]">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-[#dce3f7]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isMonitorActive ? 'bg-[#a6e3a1]' : 'bg-[#f9e2af]'
              }`}
            />
            <span>{isMonitorActive ? 'Telemetry Stream Recording' : 'Recording Suspended'}</span>
          </span>

          <span className="text-[#3b4460] hidden sm:inline">·</span>

          <div className="flex items-center gap-1">
            <span>Buffer Capacity:</span>
            <span className="font-semibold text-[#dce3f7] tabular-nums">
              4,096 Retained Records
            </span>
          </div>

          <span className="text-[#3b4460] hidden md:inline">·</span>

          <div className="hidden md:flex items-center gap-1">
            <span>Precision:</span>
            <span className="text-[#dce3f7] font-medium">Millisecond Time-Series</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#9aa3c2] shrink-0">
          <span>Clock:</span>
          <span className="font-semibold text-[#fab387] tabular-nums font-mono text-[11px] sm:text-xs">
            {clockString}
          </span>
        </div>
      </div>
    </div>
  );
};
