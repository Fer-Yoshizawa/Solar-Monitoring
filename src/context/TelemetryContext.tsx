import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CircuitRoom, TelemetryFrame, SystemMetrics, TimeSpan, EventCategory } from '../types/telemetry';

const STORAGE_KEYS = {
  CIRCUITS: 'solar_monitor_circuits_v3',
  TARGET_CAP: 'solar_monitor_target_cap_v3',
  MONITOR_ACTIVE: 'solar_monitor_active_state_v3',
  FRAMES: 'solar_monitor_frames_v3',
};

const DEFAULT_CIRCUITS: CircuitRoom[] = [
  { id: 'c1', name: 'Classroom', type: 'Standard', allocatedKw: 1.2, isActive: true, connected: true },
  { id: 'c2', name: 'Lab Computer', type: 'Standard', allocatedKw: 1.8, isActive: true, connected: true },
  { id: 'c3', name: 'Lab Electronics', type: 'Priority', allocatedKw: 0.6, isActive: true, connected: true },
  { id: 'c4', name: 'Lab Chemical', type: 'Priority', allocatedKw: 0.5, isActive: true, connected: true },
  { id: 'c5', name: 'Lab Sound & Video', type: 'Standard', allocatedKw: 0.6, isActive: true, connected: true },
  { id: 'c6', name: 'Lab Light Machinery', type: 'Standard', allocatedKw: 0.5, isActive: true, connected: true },
];

const INITIAL_LIVE_FRAMES: TelemetryFrame[] = [
  { id: 1, time: "14:32:00.104", sensor: "Inverter String B", event: "Output Sample", category: "outputs", value: "6.402 kW", delta: "+0.012 kW", deltaColor: "status-green", status: "Nominal", statusColor: "status-green", rawVal: 6.402, unit: "kW" },
  { id: 2, time: "14:31:55.082", sensor: "Room Circuit: Classroom", event: "Allocation Shift", category: "allocations", value: "1.200 kW", delta: "-0.100 kW", deltaColor: "text-subtext", subtext: "(manual)", status: "Applied", statusColor: "solar-peach", rawVal: 1.2, unit: "kW" },
  { id: 3, time: "14:31:50.011", sensor: "Inverter String A", event: "Voltage Check", category: "outputs", value: "418.2 V", delta: "0.0 V", deltaColor: "text-subtext", status: "Nominal", statusColor: "status-green", rawVal: 418.2, unit: "V" },
  { id: 4, time: "14:31:45.008", sensor: "Battery Reserve BMS", event: "State of Charge", category: "outputs", value: "78.4%", delta: "-0.1%", deltaColor: "text-subtext", status: "Nominal", statusColor: "status-green", rawVal: 78.4, unit: "%" },
  { id: 5, time: "14:31:30.980", sensor: "Ambient Pyranometer", event: "Irradiance", category: "outputs", value: "742.1 W/m²", delta: "+8.4 W/m²", deltaColor: "warning-yellow", status: "High Solar", statusColor: "warning-yellow", rawVal: 742.1, unit: "W/m²" },
  { id: 6, time: "14:31:15.420", sensor: "Room Circuit: Lab Computer", event: "Load Meter", category: "allocations", value: "1.794 kW", delta: "+0.024 kW", deltaColor: "text-subtext", status: "Nominal", statusColor: "status-green", rawVal: 1.794, unit: "kW" },
  { id: 7, time: "14:30:58.115", sensor: "Sub-Distribution Bus A-1", event: "Frequency", category: "outputs", value: "60.002 Hz", delta: "+0.001 Hz", deltaColor: "status-green", status: "Stable", statusColor: "status-green", rawVal: 60.002, unit: "Hz" },
  { id: 8, time: "14:30:42.003", sensor: "Panel Temp Sensor #3", event: "Thermal Probe", category: "outputs", value: "38.4 °C", delta: "+0.2 °C", deltaColor: "text-subtext", status: "Within Limits", statusColor: "status-green", rawVal: 38.4, unit: "°C" },
  { id: 9, time: "14:30:00.000", sensor: "System Controller", event: "Epoch Sync", category: "allocations", value: "NTP Stratum 1", delta: "0.2 ms offset", deltaColor: "text-subtext", status: "Synced", statusColor: "surface-border", rawVal: 0.2, unit: "ms" },
  { id: 10, time: "14:28:14.220", sensor: "Room Circuit: Lab Chemical", event: "Priority Lock", category: "allocations", value: "Set Priority Flag", delta: "Circuit A4", deltaColor: "text-subtext", status: "Priority", statusColor: "warning-yellow", rawVal: 1, unit: "flag" },
  { id: 11, time: "14:26:40.100", sensor: "Battery Reserve BMS", event: "Cell Voltage Drift", category: "alerts", value: "3.48 V cell #4", delta: "+0.14 V delta", deltaColor: "danger-red", status: "Deviation Alert", statusColor: "danger-red", rawVal: 3.48, unit: "V" },
  { id: 12, time: "14:24:10.518", sensor: "Inverter MPPT #2", event: "Efficiency Dip", category: "alerts", value: "92.1% yield", delta: "-4.2% drop", deltaColor: "danger-red", status: "Warning", statusColor: "danger-red", rawVal: 92.1, unit: "%" },
  { id: 13, time: "14:21:05.890", sensor: "Ambient Temp Probe", event: "Thermal Warning", category: "alerts", value: "44.6 °C rack", delta: "+3.8 °C rise", deltaColor: "danger-red", status: "High Thermal", statusColor: "danger-red", rawVal: 44.6, unit: "°C" },
];

const TODAY_FRAMES: TelemetryFrame[] = [
  { id: 101, time: "12:15:00.000", sensor: "Inverter String B", event: "Peak Output Spike", category: "outputs", value: "8.910 kW", delta: "+0.450 kW", deltaColor: "status-green", status: "Daily Peak", statusColor: "status-green", rawVal: 8.91, unit: "kW" },
  { id: 102, time: "11:45:22.312", sensor: "Room Circuit: Machinery", event: "Allocation Shift", category: "allocations", value: "3.240 kW", delta: "+0.500 kW", deltaColor: "solar-peach", status: "Applied", statusColor: "solar-peach", rawVal: 3.24, unit: "kW" },
  { id: 103, time: "10:30:14.502", sensor: "Inverter String A", event: "Voltage Check", category: "outputs", value: "419.8 V", delta: "+1.6 V", deltaColor: "status-green", status: "Nominal", statusColor: "status-green", rawVal: 419.8, unit: "V" },
  { id: 104, time: "09:00:10.015", sensor: "Battery Reserve BMS", event: "Charge Phase Entry", category: "allocations", value: "Bulk Fast Charge", delta: "+12.0 A", deltaColor: "status-green", status: "Charging", statusColor: "solar-peach", rawVal: 12.0, unit: "A" },
  { id: 105, time: "08:12:44.200", sensor: "Array String B Junction", event: "Thermal Warning", category: "alerts", value: "62.1 °C", delta: "+11.4 °C", deltaColor: "danger-red", status: "High Thermal", statusColor: "danger-red", rawVal: 62.1, unit: "°C" },
  { id: 106, time: "07:30:00.890", sensor: "Solar Inverter Master", event: "Dawn Relay Engage", category: "outputs", value: "1.210 kW", delta: "+1.210 kW", deltaColor: "solar-peach", status: "Online", statusColor: "status-green", rawVal: 1.21, unit: "kW" },
  { id: 107, time: "06:15:30.120", sensor: "Sub-Distribution Bus A-1", event: "Frequency Lock", category: "outputs", value: "59.998 Hz", delta: "-0.002 Hz", deltaColor: "text-subtext", status: "Stable", statusColor: "status-green", rawVal: 59.998, unit: "Hz" },
  { id: 108, time: "04:10:05.002", sensor: "Night Isolation Relay", event: "Allocation Shift", category: "allocations", value: "0.200 kW Idle", delta: "0.0 kW", deltaColor: "text-subtext", status: "Standby", statusColor: "surface-border", rawVal: 0.2, unit: "kW" },
  { id: 109, time: "02:00:00.000", sensor: "Firmware Kernel", event: "Memory Scrub", category: "allocations", value: "0 Faults", delta: "128MB ECC", deltaColor: "status-green", status: "Nominal", statusColor: "status-green", rawVal: 0, unit: "err" },
  { id: 110, time: "00:45:12.784", sensor: "Grid Tied Inverter", event: "Island Check", category: "outputs", value: "0.000 kW Flow", delta: "0.000 kW", deltaColor: "text-subtext", status: "Idle", statusColor: "surface-border", rawVal: 0, unit: "kW" },
];

const WEEK_FRAMES: TelemetryFrame[] = [
  { id: 201, time: "Day -1 13:40", sensor: "Inverter String A", event: "Output Sample", category: "outputs", value: "7.840 kW", delta: "+0.120 kW", deltaColor: "status-green", status: "Nominal", statusColor: "status-green", rawVal: 7.84, unit: "kW" },
  { id: 202, time: "Day -2 11:20", sensor: "Battery Reserve BMS", event: "Full Absorption Cap", category: "allocations", value: "99.8% SOC", delta: "+2.4%", deltaColor: "status-green", status: "Full Charge", statusColor: "status-green", rawVal: 99.8, unit: "%" },
  { id: 203, time: "Day -3 15:10", sensor: "Main Breaker Room C", event: "High Current Trip", category: "alerts", value: "68.4 A peak", delta: "+14.2 A surge", deltaColor: "danger-red", status: "Breaker Trip", statusColor: "danger-red", rawVal: 68.4, unit: "A" },
  { id: 204, time: "Day -4 14:05", sensor: "Room Circuit: Classroom", event: "Allocation Shift", category: "allocations", value: "2.100 kW", delta: "+0.300 kW", deltaColor: "solar-peach", status: "Applied", statusColor: "solar-peach", rawVal: 2.1, unit: "kW" },
  { id: 205, time: "Day -5 12:00", sensor: "Ambient Pyranometer", event: "Peak Irradiance Log", category: "outputs", value: "980.2 W/m²", delta: "+15.0 W/m²", deltaColor: "warning-yellow", status: "High Solar", statusColor: "warning-yellow", rawVal: 980.2, unit: "W/m²" },
  { id: 206, time: "Day -6 16:30", sensor: "Inverter String B", event: "Output Sample", category: "outputs", value: "5.110 kW", delta: "-0.400 kW", deltaColor: "text-subtext", status: "Nominal", statusColor: "status-green", rawVal: 5.11, unit: "kW" },
  { id: 207, time: "Day -7 09:15", sensor: "Lab Chemical Ventilator", event: "Allocation Shift", category: "allocations", value: "1.450 kW", delta: "+0.250 kW", deltaColor: "solar-peach", status: "Applied", statusColor: "solar-peach", rawVal: 1.45, unit: "kW" },
];

interface TelemetryContextType {
  activeView: 'console' | 'telemetry-log';
  setActiveView: (view: 'console' | 'telemetry-log') => void;
  circuits: CircuitRoom[];
  targetBudgetCap: number;
  totalAllocated: number;
  remainingReserve: number;
  isOverAllocated: boolean;
  overageKw: number;
  systemMetrics: SystemMetrics;
  isMonitorActive: boolean;
  toggleMonitor: () => void;
  updateCircuit: (id: string, updates: Partial<CircuitRoom>) => void;
  addCircuit: (circuit: Omit<CircuitRoom, 'id'>) => void;
  deleteCircuit: (id: string) => void;
  setTargetBudgetCap: (val: number) => void;
  autoShedLoads: () => void;
  // Log view state
  currentSpan: TimeSpan;
  setCurrentSpan: (span: TimeSpan) => void;
  currentCategory: EventCategory;
  setCurrentCategory: (category: EventCategory) => void;
  isAutoScrollOn: boolean;
  setIsAutoScrollOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  getFilteredFrames: () => TelemetryFrame[];
  categoryCounts: { all: number; allocations: number; outputs: number; alerts: number };
  newFrameFlashId: number | string | null;
  exportCSV: (span?: TimeSpan) => void;
  exportJSON: (span?: TimeSpan) => void;
  exportFullBuffer: () => void;
  todayGeneration: number;
  setTodayGeneration: (val: number | ((prev: number) => number)) => void;
  incrementTodayGeneration: (amount?: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'console' | 'telemetry-log'>('console');

  // Circuits state
  const [circuits, setCircuits] = useState<CircuitRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CIRCUITS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CIRCUITS;
  });

  // Target budget cap
  const [targetBudgetCap, setTargetBudgetCapState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TARGET_CAP);
      if (saved) return parseFloat(saved);
    } catch (e) {
      console.error(e);
    }
    return 6.4;
  });

  // Master monitor switch
  const [isMonitorActive, setIsMonitorActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MONITOR_ACTIVE);
      if (saved !== null) return saved === 'true';
    } catch (e) {
      console.error(e);
    }
    return true;
  });

  // Telemetry frame store
  const [allFrames, setAllFrames] = useState<{ live: TelemetryFrame[]; today: TelemetryFrame[]; week: TelemetryFrame[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FRAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.live && parsed.today && parsed.week) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      live: INITIAL_LIVE_FRAMES,
      today: TODAY_FRAMES,
      week: WEEK_FRAMES,
    };
  });

  // Filter states
  const [currentSpan, setCurrentSpan] = useState<TimeSpan>('live');
  const [currentCategory, setCurrentCategory] = useState<EventCategory>('all');
  const [isAutoScrollOn, setIsAutoScrollOn] = useState<boolean>(true);
  const [newFrameFlashId, setNewFrameFlashId] = useState<number | string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // System metrics state with dynamic flux rate
  const [fluxJitter, setFluxJitter] = useState<number>(0);
  const [metricsClock, setMetricsClock] = useState<number>(Date.now());

  // Save persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CIRCUITS, JSON.stringify(circuits));
    } catch (e) {}
  }, [circuits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARGET_CAP, targetBudgetCap.toString());
    } catch (e) {}
  }, [targetBudgetCap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MONITOR_ACTIVE, isMonitorActive.toString());
    } catch (e) {}
  }, [isMonitorActive]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(allFrames));
    } catch (e) {}
  }, [allFrames]);

  // Derived budget math
  const totalAllocated = useMemo(() => {
    const sum = circuits
      .filter((c) => c.isActive)
      .reduce((acc, curr) => acc + curr.allocatedKw, 0);
    return Math.round(sum * 100) / 100;
  }, [circuits]);

  const remainingReserve = useMemo(() => {
    const diff = targetBudgetCap - totalAllocated;
    return Math.round(diff * 100) / 100;
  }, [targetBudgetCap, totalAllocated]);

  const isOverAllocated = totalAllocated > targetBudgetCap;
  const overageKw = isOverAllocated ? Math.round((totalAllocated - targetBudgetCap) * 100) / 100 : 0;

  // Today's Generation accumulator state
  const [todayGeneration, setTodayGeneration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('solar_monitor_today_gen_v3');
      if (saved) return parseFloat(saved);
    } catch (e) {}
    return 18.24;
  });

  useEffect(() => {
    try {
      localStorage.setItem('solar_monitor_today_gen_v3', todayGeneration.toString());
    } catch (e) {}
  }, [todayGeneration]);

  const incrementTodayGeneration = useCallback((amount = 0.15) => {
    setTodayGeneration((prev) => Math.round((prev + amount) * 100) / 100);
  }, []);

  // Continuous real-time energy generation accumulation while monitoring is LIVE
  useEffect(() => {
    if (!isMonitorActive) return;
    const genInterval = setInterval(() => {
      // Accumulate ~0.01 kWh every 5 seconds under active 6.3 kW flux
      setTodayGeneration((prev) => Math.round((prev + 0.01) * 100) / 100);
    }, 5000);
    return () => clearInterval(genInterval);
  }, [isMonitorActive]);

  // System Metrics
  const baseFlux = 6.30;
  const currentFlux = isMonitorActive ? Math.round((baseFlux + fluxJitter) * 100) / 100 : 0.00;

  const systemMetrics: SystemMetrics = useMemo(() => ({
    currentFluxRate: currentFlux,
    peakToday: 8.91,
    peakTime: "12:15",
    totalGeneration: todayGeneration,
    cumulative30d: 541.8,
    busVoltage: isMonitorActive ? 418.2 : 48.0,
    inverterEfficiency: isMonitorActive ? 98.4 : 0.0,
    dataStreamIntegrity: isMonitorActive ? 100.0 : 0.0,
    dropouts: 0,
    batterySoc: 78,
    batteryVoltage: 52.4,
    ambientIrradiance: isMonitorActive ? 737 : 0,
    surfaceTemp: 38.3,
    inverterCoreTemp: 48.2,
    stringANominal: isMonitorActive ? 99.8 : 0,
    stringBNominal: isMonitorActive ? 100.0 : 0,
    panelArrayCapacityMax: 10.0,
    targetBudgetCap,
    isMonitorActive,
  }), [currentFlux, isMonitorActive, targetBudgetCap, todayGeneration]);

  // Telemetry drift and frame generator simulation
  useEffect(() => {
    if (!isMonitorActive) return;

    const jitterInterval = setInterval(() => {
      // Subtle organic power fluctuation ±0.06 kW
      const jitter = (Math.random() * 0.12 - 0.06);
      setFluxJitter(Math.round(jitter * 100) / 100);
      setMetricsClock(Date.now());
    }, 2400);

    return () => clearInterval(jitterInterval);
  }, [isMonitorActive]);

  // Real-time automatic frame injection
  useEffect(() => {
    if (!isMonitorActive || !isAutoScrollOn || currentSpan !== 'live') return;

    const frameGenerators = [
      () => ({
        sensor: "Inverter String B",
        event: "Output Sample",
        category: "outputs" as const,
        value: `${(6.4 + Math.random() * 0.04).toFixed(3)} kW`,
        delta: `+${(Math.random() * 0.03 + 0.005).toFixed(3)} kW`,
        deltaColor: "status-green" as const,
        status: "Nominal",
        statusColor: "status-green" as const,
      }),
      () => ({
        sensor: "Inverter String A",
        event: "Voltage Check",
        category: "outputs" as const,
        value: `${(418.0 + Math.random() * 0.5).toFixed(1)} V`,
        delta: `${(Math.random() * 0.2 - 0.1).toFixed(1)} V`,
        deltaColor: "text-subtext" as const,
        status: "Nominal",
        statusColor: "status-green" as const,
      }),
      () => ({
        sensor: "Ambient Pyranometer",
        event: "Irradiance",
        category: "outputs" as const,
        value: `${(740 + Math.random() * 5).toFixed(1)} W/m²`,
        delta: `+${(Math.random() * 4).toFixed(1)} W/m²`,
        deltaColor: "warning-yellow" as const,
        status: "High Solar",
        statusColor: "warning-yellow" as const,
      }),
      () => ({
        sensor: "Battery Reserve BMS",
        event: "State of Charge",
        category: "outputs" as const,
        value: "78.4%",
        delta: "-0.01%",
        deltaColor: "text-subtext" as const,
        status: "Nominal",
        statusColor: "status-green" as const,
      }),
      () => ({
        sensor: "Sub-Distribution Bus A-1",
        event: "Frequency",
        category: "outputs" as const,
        value: `${(60.000 + (Math.random() * 0.004 - 0.002)).toFixed(3)} Hz`,
        delta: "+0.001 Hz",
        deltaColor: "status-green" as const,
        status: "Stable",
        statusColor: "status-green" as const,
      }),
    ];

    const streamInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(now.getUTCMilliseconds()).padStart(3, '0')}`;
      const gen = frameGenerators[Math.floor(Math.random() * frameGenerators.length)];
      const frameData = gen();
      const frameId = Date.now();

      const newFrame: TelemetryFrame = {
        id: frameId,
        time: timeStr,
        ...frameData,
      };

      setNewFrameFlashId(frameId);
      setTimeout(() => setNewFrameFlashId(null), 2500);

      setAllFrames((prev) => ({
        ...prev,
        live: [newFrame, ...prev.live.slice(0, 4095)],
      }));
    }, 3600);

    return () => clearInterval(streamInterval);
  }, [isMonitorActive, isAutoScrollOn, currentSpan]);

  // Circuit actions
  const updateCircuit = useCallback((id: string, updates: Partial<CircuitRoom>) => {
    setCircuits((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const target = next.find((c) => c.id === id);
      if (target && updates.allocatedKw !== undefined) {
        // Log Allocation Shift in real-time
        const now = new Date();
        const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(now.getUTCMilliseconds()).padStart(3, '0')}`;
        const newLog: TelemetryFrame = {
          id: Date.now(),
          time: timeStr,
          sensor: `Room Circuit: ${target.name}`,
          event: "Allocation Shift",
          category: "allocations",
          value: `${target.allocatedKw.toFixed(3)} kW`,
          delta: `${updates.allocatedKw >= target.allocatedKw ? '+' : ''}${(updates.allocatedKw - target.allocatedKw).toFixed(3)} kW`,
          deltaColor: "solar-peach",
          subtext: "(manual)",
          status: "Applied",
          statusColor: "solar-peach",
          rawVal: target.allocatedKw,
          unit: "kW",
        };
        setAllFrames((f) => ({ ...f, live: [newLog, ...f.live.slice(0, 4095)] }));
      }
      return next;
    });
  }, []);

  const addCircuit = useCallback((circuit: Omit<CircuitRoom, 'id'>) => {
    const newId = `c_${Date.now()}`;
    const newCircuit: CircuitRoom = { ...circuit, id: newId };
    setCircuits((prev) => [...prev, newCircuit]);
    showToast(`Added circuit "${circuit.name}" (${circuit.allocatedKw} kW)`);

    // Log addition
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(now.getUTCMilliseconds()).padStart(3, '0')}`;
    const newLog: TelemetryFrame = {
      id: Date.now(),
      time: timeStr,
      sensor: `Room Circuit: ${circuit.name}`,
      event: "Allocation Shift",
      category: "allocations",
      value: `${circuit.allocatedKw.toFixed(3)} kW`,
      delta: `+${circuit.allocatedKw.toFixed(3)} kW`,
      deltaColor: "solar-peach",
      subtext: "(new circuit)",
      status: "Provisioned",
      statusColor: "solar-peach",
    };
    setAllFrames((f) => ({ ...f, live: [newLog, ...f.live.slice(0, 4095)] }));
  }, [showToast]);

  const deleteCircuit = useCallback((id: string) => {
    const target = circuits.find((c) => c.id === id);
    if (!target) return;
    setCircuits((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed circuit "${target.name}"`);
  }, [circuits, showToast]);

  const setTargetBudgetCap = useCallback((val: number) => {
    const clamped = Math.max(1.0, Math.min(10.0, Math.round(val * 10) / 10));
    setTargetBudgetCapState(clamped);
    showToast(`Target budget cap adjusted to ${clamped.toFixed(1)} kW`);
  }, [showToast]);

  const toggleMonitor = useCallback(() => {
    setIsMonitorActive((prev) => {
      const next = !prev;
      showToast(next ? "Master monitoring activated (LIVE)" : "Master monitoring standby (sampling paused)");
      return next;
    });
  }, [showToast]);

  // Automated Load Shedding: Sequence order: Classroom -> Lab Sound & Video -> Machinery
  const autoShedLoads = useCallback(() => {
    if (!isOverAllocated) return;
    let deficit = totalAllocated - targetBudgetCap;

    const shedOrder = ['Classroom', 'Lab Sound & Video', 'Lab Light Machinery'];

    setCircuits((prev) => {
      let currentDeficit = deficit;
      const updated = prev.map((c) => ({ ...c }));

      // First pass: shed from non-priority standard rooms in sequence
      for (const name of shedOrder) {
        const room = updated.find((r) => r.name.toLowerCase().includes(name.toLowerCase()) && r.type !== 'Priority' && r.isActive && r.allocatedKw > 0);
        if (room && currentDeficit > 0) {
          const reduction = Math.min(room.allocatedKw, currentDeficit);
          room.allocatedKw = Math.max(0, Math.round((room.allocatedKw - reduction) * 10) / 10);
          if (room.allocatedKw === 0) room.isActive = false;
          currentDeficit -= reduction;
        }
      }

      // If still over-allocated, throttle any remaining standard rooms
      if (currentDeficit > 0) {
        for (const room of updated) {
          if (room.type === 'Standard' && room.isActive && room.allocatedKw > 0 && currentDeficit > 0) {
            const reduction = Math.min(room.allocatedKw, currentDeficit);
            room.allocatedKw = Math.max(0, Math.round((room.allocatedKw - reduction) * 10) / 10);
            if (room.allocatedKw === 0) room.isActive = false;
            currentDeficit -= reduction;
          }
        }
      }

      return updated;
    });

    showToast("Automatic load shedding applied: lower-priority circuits throttled");

    // Add alert log
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(now.getUTCMilliseconds()).padStart(3, '0')}`;
    const shedLog: TelemetryFrame = {
      id: Date.now(),
      time: timeStr,
      sensor: "System Controller",
      event: "Load Shed Policy",
      category: "alerts",
      value: `Shed -${deficit.toFixed(2)} kW`,
      delta: `Cap: ${targetBudgetCap} kW`,
      deltaColor: "danger-red",
      status: "Safeguard Applied",
      statusColor: "warning-yellow",
    };
    setAllFrames((f) => ({ ...f, live: [shedLog, ...f.live.slice(0, 4095)] }));
  }, [isOverAllocated, totalAllocated, targetBudgetCap, showToast]);

  // Filtering for table
  const getFilteredFrames = useCallback(() => {
    const dataset = allFrames[currentSpan] || [];
    if (currentCategory === 'all') return dataset;
    return dataset.filter((f) => f.category === currentCategory);
  }, [allFrames, currentSpan, currentCategory]);

  const categoryCounts = useMemo(() => {
    const dataset = allFrames[currentSpan] || [];
    return {
      all: dataset.length,
      allocations: dataset.filter((f) => f.category === 'allocations').length,
      outputs: dataset.filter((f) => f.category === 'outputs').length,
      alerts: dataset.filter((f) => f.category === 'alerts').length,
    };
  }, [allFrames, currentSpan]);

  // Data Export Handlers
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = useCallback((span: TimeSpan = currentSpan) => {
    const data = allFrames[span] || [];
    const headers = ["Timestamp", "Sensor_Node", "Event_Type", "Category", "Measured_Value", "Delta_Drift", "Status"];
    const rows = data.map((r) => [
      `"${r.time}"`,
      `"${r.sensor}"`,
      `"${r.event}"`,
      `"${r.category}"`,
      `"${r.value}"`,
      `"${r.delta}"`,
      `"${r.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    downloadFile(`solar_telemetry_${span}.csv`, csvContent, 'text/csv;charset=utf-8;');
    showToast(`Exported solar_telemetry_${span}.csv`);
  }, [allFrames, currentSpan, showToast]);

  const exportJSON = useCallback((span: TimeSpan = currentSpan) => {
    const data = allFrames[span] || [];
    const exportData = {
      system: "Solar Monitor Lab Instrument Ref. L-402",
      exported_at_utc: new Date().toISOString(),
      span,
      category_filter: currentCategory,
      frame_count: data.length,
      frames: data,
    };
    downloadFile(`telemetry_frames_${span}.json`, JSON.stringify(exportData, null, 2), 'application/json');
    showToast(`Exported telemetry_frames_${span}.json`);
  }, [allFrames, currentSpan, currentCategory, showToast]);

  const exportFullBuffer = useCallback(() => {
    const fullDump = [];
    const now = Date.now();
    for (let i = 0; i < 4096; i++) {
      const t = new Date(now - i * 1000).toISOString();
      fullDump.push({
        frame_index: 4096 - i,
        timestamp: t,
        inverter_voltage_vdc: (418 + Math.sin(i * 0.05) * 2.4).toFixed(2),
        flux_kw: (6.42 + Math.cos(i * 0.02) * 0.8).toFixed(3),
        battery_soc: (78.4 - i * 0.001).toFixed(2),
        parity: "VALID_CRC32_0x9AF831B",
      });
    }
    const dumpPayload = {
      buffer_capacity: 4096,
      ring_type: "FIFO Cyclic Hardware Dump",
      generated_utc: new Date().toISOString(),
      checksum: "0x9AF831B",
      frames: fullDump,
    };
    downloadFile('telemetry_raw_buffer_4096.json', JSON.stringify(dumpPayload, null, 2), 'application/json');
    showToast("Downloaded full hardware buffer (4,096 frames)");
  }, [showToast]);

  return (
    <TelemetryContext.Provider
      value={{
        activeView,
        setActiveView,
        circuits,
        targetBudgetCap,
        totalAllocated,
        remainingReserve,
        isOverAllocated,
        overageKw,
        systemMetrics,
        isMonitorActive,
        toggleMonitor,
        updateCircuit,
        addCircuit,
        deleteCircuit,
        setTargetBudgetCap,
        autoShedLoads,
        currentSpan,
        setCurrentSpan,
        currentCategory,
        setCurrentCategory,
        isAutoScrollOn,
        setIsAutoScrollOn,
        getFilteredFrames,
        categoryCounts,
        newFrameFlashId,
        exportCSV,
        exportJSON,
        exportFullBuffer,
        todayGeneration,
        setTodayGeneration,
        incrementTodayGeneration,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
};
