export type CircuitPriority = 'Standard' | 'Priority';

export interface CircuitRoom {
  id: string;
  name: string;
  type: CircuitPriority;
  allocatedKw: number;
  isActive: boolean;
  connected: boolean;
}

export type EventCategory = 'all' | 'allocations' | 'outputs' | 'alerts';
export type TimeSpan = 'live' | 'today' | 'week';

export interface TelemetryFrame {
  id: number | string;
  time: string;
  sensor: string;
  event: string;
  category: 'allocations' | 'outputs' | 'alerts';
  value: string;
  delta: string;
  deltaColor: 'status-green' | 'solar-peach' | 'warning-yellow' | 'danger-red' | 'text-subtext';
  subtext?: string;
  status: string;
  statusColor: 'status-green' | 'solar-peach' | 'warning-yellow' | 'danger-red' | 'surface-border';
  rawVal?: number;
  unit?: string;
}

export interface SystemMetrics {
  currentFluxRate: number; // in kW (e.g., 6.3 - 6.42)
  peakToday: number; // in kW (e.g., 8.91)
  peakTime: string; // "12:15"
  totalGeneration: number; // in kWh (e.g., 18.24)
  cumulative30d: number; // in kWh (e.g., 541.8)
  busVoltage: number; // in V DC (e.g., 418.2)
  inverterEfficiency: number; // % (e.g., 98.4)
  dataStreamIntegrity: number; // % (e.g., 100.0)
  dropouts: number;
  batterySoc: number; // % (e.g., 78)
  batteryVoltage: number; // V (e.g., 52.4)
  ambientIrradiance: number; // W/m² (e.g., 737)
  surfaceTemp: number; // °C (e.g., 38.3)
  inverterCoreTemp: number; // °C (e.g., 48.2)
  stringANominal: number; // % (e.g., 99.8)
  stringBNominal: number; // % (e.g., 100.0)
  panelArrayCapacityMax: number; // 10.0 kW
  targetBudgetCap: number; // 6.4 kW
  isMonitorActive: boolean;
}
