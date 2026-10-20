import React, { useEffect, useRef, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity } from 'lucide-react';

export const WaveformOscillator: React.FC = () => {
  const { isMonitorActive, systemMetrics } = useTelemetry();
  const [pathD, setPathD] = useState('M0,14 Q20,3 40,14 T80,14 T120,5 T160,14 T200,8 T240,14 T280,6 T320,14');
  const [dotY, setDotY] = useState(14);
  const phaseRef = useRef(0);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (isMonitorActive) {
        phaseRef.current = (phaseRef.current + 0.08) % (Math.PI * 2);
      }
      const amp = isMonitorActive ? 1.0 : 0.15;
      const p = phaseRef.current;

      const y1 = Math.round(14 + Math.sin(p) * 10.5 * amp);
      const y2 = Math.round(14 + Math.sin(p + 1.2) * 10 * amp);
      const y3 = Math.round(14 + Math.sin(p + 2.5) * 11 * amp);
      const y4 = Math.round(14 + Math.sin(p + 3.8) * 9.5 * amp);

      const d = `M0,14 Q20,${y1} 40,14 T80,14 T120,${y2} T160,14 T200,${y3} T240,14 T280,${y4} T320,14`;
      setPathD(d);

      const calculatedDotY = 14 + (isMonitorActive ? Math.sin(p + 5.0) * 2.8 : 0);
      setDotY(calculatedDotY);

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isMonitorActive]);

  return (
    <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm">
      {/* Icon & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-[#0f111a] border border-[#3b4460] flex items-center justify-center text-[#fab387] shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-[#fab387] tracking-normal flex items-center gap-1.5">
            <span>Inverter AC Waveform</span>
            <span className="text-[#9aa3c2]">·</span>
            <span className="text-[#9aa3c2] font-normal">60.0 Hz Pure Sine</span>
          </div>
          <div className="text-sm font-medium text-[#dce3f7]">
            {isMonitorActive
              ? 'Stable AC output feeding classroom & laboratory equipment'
              : 'Oscillator idle · Data sampling paused'}
          </div>
        </div>
      </div>

      {/* SVG Wave Canvas */}
      <div className="w-full lg:flex-1 min-w-[200px] max-w-full lg:max-w-lg h-9 bg-[#0f111a] rounded-lg border border-[#3b4460] px-2 flex items-center overflow-hidden">
        <svg
          className="w-full h-7 min-h-[28px] text-[#fab387]"
          preserveAspectRatio="none"
          viewBox="0 0 320 28"
          role="img"
          aria-label="Real-time waveform simulation"
        >
          {/* Reference baseline */}
          <path
            d="M0,14 Q20,2 40,14 T80,14 T120,14 T160,14 T200,14 T240,14 T280,14 T320,14"
            fill="none"
            stroke="#2b3247"
            strokeDasharray="3,3"
            strokeWidth="1"
          />
          {/* Oscillating curve */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          {/* Leading trace dot */}
          <circle
            cx="320"
            cy={dotY}
            fill="#a6e3a1"
            r="3"
          />
        </svg>
      </div>

      {/* Probes Readout */}
      <div className="flex items-center gap-4 text-xs sm:text-sm text-[#9aa3c2] shrink-0 justify-between lg:justify-end">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#9aa3c2]">Solar Irradiance:</span>
          <span className="font-semibold text-[#dce3f7] tabular-nums">
            {isMonitorActive ? '742' : '0'} W/m²
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#9aa3c2]">Inverter Core:</span>
          <span className="font-semibold text-[#dce3f7] tabular-nums">
            {systemMetrics.inverterCoreTemp.toFixed(1)}°C
          </span>
        </div>
      </div>
    </div>
  );
};
