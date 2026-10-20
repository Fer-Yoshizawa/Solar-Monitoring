import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { CalibrationStrip } from './CalibrationStrip';
import { AddRoomModal } from './AddRoomModal';
import { Plus, Trash2, Shield, AlertTriangle, Zap, RotateCw } from 'lucide-react';

export const ConsoleView: React.FC = () => {
  const {
    circuits,
    targetBudgetCap,
    setTargetBudgetCap,
    totalAllocated,
    remainingReserve,
    isOverAllocated,
    overageKw,
    systemMetrics,
    updateCircuit,
    deleteCircuit,
    autoShedLoads,
    isMonitorActive,
    showToast,
    incrementTodayGeneration,
  } = useTelemetry();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshingTotal, setIsRefreshingTotal] = useState(false);

  const handleRefreshTodayTotal = () => {
    if (isRefreshingTotal) return;
    setIsRefreshingTotal(true);
    incrementTodayGeneration(0.15);
    showToast("Re-aggregating bus telemetry feeds...");
    setTimeout(() => {
      setIsRefreshingTotal(false);
      showToast(`Today's generation updated (+0.15 kWh logged)`);
    }, 600);
  };

  // Percentage of max array capacity (10 kW)
  const capacityPct = Math.min(100, Math.round((systemMetrics.currentFluxRate / systemMetrics.panelArrayCapacityMax) * 100));

  // Percentage of allocated budget
  const allocatedPct = Math.min(100, Math.round((totalAllocated / targetBudgetCap) * 100));

  return (
    <div className="flex flex-col w-full pb-24 sm:pb-16">
      {/* Top Calibration Strip */}
      <CalibrationStrip variant="console" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Over-allocation Alert Banner */}
        {isOverAllocated && (
          <div className="w-full bg-[#181b29] border border-[#f38ba8]/80 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f38ba8]/15 border border-[#f38ba8]/30 flex items-center justify-center text-[#f38ba8] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#f38ba8]">
                  Power Allocation Exceeded by +{overageKw.toFixed(2)} kW
                </div>
                <div className="text-xs text-[#9aa3c2]">
                  Total facility demand exceeds target budget cap of {targetBudgetCap.toFixed(1)} kW. Non-essential circuits can be throttled.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={autoShedLoads}
              className="px-3.5 py-2 rounded-lg bg-[#f38ba8]/15 hover:bg-[#f38ba8]/25 border border-[#f38ba8] text-[#f38ba8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              Automatic Load Shed
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: LIVE SOLAR GENERATION & METRICS (5 cols / ~42%)   */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Live Solar Output Card */}
            <div className="bg-[#181b29] border border-[#3b4460]/80 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1.5">
                <span className="font-medium">Rooftop Solar Array</span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isMonitorActive ? 'bg-[#a6e3a1]' : 'bg-[#9aa3c2]'}`} />
                  <span className={isMonitorActive ? 'text-[#a6e3a1]' : 'text-[#9aa3c2]'}>
                    {isMonitorActive ? 'Strings A & B Active' : 'Sensors Standby'}
                  </span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#dce3f7] mb-1">
                Current Solar Generation
              </h2>
              <p className="text-xs text-[#9aa3c2] mb-4">
                Real-time clean electricity powering building circuits and charging battery reserves
              </p>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight text-[#dce3f7] tabular-nums">
                  {systemMetrics.currentFluxRate.toFixed(1)}
                </span>
                <span className="text-2xl font-bold text-[#fab387]">kW</span>
              </div>

              {/* Panel Array Capacity Gauge */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-[#3b4460]/50">
                <div className="flex items-center justify-between text-xs text-[#9aa3c2]">
                  <span>Array Capacity Utilization</span>
                  <span className="font-semibold text-[#dce3f7] tabular-nums">
                    {systemMetrics.currentFluxRate.toFixed(1)} / {systemMetrics.panelArrayCapacityMax.toFixed(1)} kW ({capacityPct}%)
                  </span>
                </div>
                <div className="w-full bg-[#0f111a] h-2.5 rounded-full border border-[#3b4460] overflow-hidden p-0.5">
                  <div
                    className="bg-[#fab387] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(250,179,135,0.4)]"
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Split Metrics Row: Today's Total & Battery Reserve */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Today's Generation */}
              <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
                  <span className="font-medium">Today's Generation</span>
                  <button
                    type="button"
                    onClick={handleRefreshTodayTotal}
                    title="Refresh and aggregate today's generation"
                    aria-label="Refresh Today's Generation"
                    className="p-1 -m-1 rounded hover:bg-[#272d40] text-[#9aa3c2] hover:text-[#fab387] active:scale-95 transition-all cursor-pointer focus:outline-none"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 transition-transform ${
                        isRefreshingTotal ? 'animate-spin text-[#fab387]' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span
                    className={`text-2xl sm:text-3xl font-bold tabular-nums transition-colors duration-200 ${
                      systemMetrics.totalGeneration > 18.2
                        ? 'text-[#a6e3a1]'
                        : systemMetrics.totalGeneration < 18.2
                        ? 'text-[#f9e2af]'
                        : 'text-[#dce3f7]'
                    }`}
                  >
                    {systemMetrics.totalGeneration.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-[#fab387]">kWh</span>
                  {Math.abs(systemMetrics.totalGeneration - 18.2) >= 0.05 && (
                    <span
                      className={`ml-1 text-xs font-semibold tabular-nums font-mono ${
                        systemMetrics.totalGeneration > 18.2 ? 'text-[#a6e3a1]' : 'text-[#f9e2af]'
                      }`}
                    >
                      ({systemMetrics.totalGeneration > 18.2 ? '+' : ''}
                      {(systemMetrics.totalGeneration - 18.2).toFixed(2)})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#9aa3c2]">Accumulated since sunrise</div>
              </div>

              {/* Battery Reserve */}
              <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
                  <span className="font-medium">Battery Reserve</span>
                  <span className="text-[11px] text-[#a6e3a1] font-medium">Float Stage</span>
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#dce3f7] tabular-nums">
                    {systemMetrics.batterySoc}%
                  </span>
                  <span className="text-xs text-[#9aa3c2]">LiFePO4 · 52.4V</span>
                </div>
                <div className="w-full bg-[#0f111a] h-2 rounded-full border border-[#3b4460] overflow-hidden mb-1.5">
                  <div
                    className="bg-[#a6e3a1] h-full rounded-full transition-all duration-300"
                    style={{ width: `${systemMetrics.batterySoc}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#9aa3c2]">Ready for evening discharge</div>
              </div>
            </div>

            {/* Split Metrics Row: Ambient Irradiance & Surface Temp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sunlight Irradiance */}
              <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="text-xs text-[#9aa3c2] font-medium mb-1">
                  Sunlight Irradiance
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#dce3f7] tabular-nums">
                    {systemMetrics.ambientIrradiance}
                  </span>
                  <span className="text-sm font-semibold text-[#f9e2af]">W/m²</span>
                </div>
                <div className="text-[11px] text-[#9aa3c2]">Clear sky solar radiation</div>
              </div>

              {/* Panel Temperature */}
              <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="text-xs text-[#9aa3c2] font-medium mb-1">
                  Panel Surface Temp
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#dce3f7] tabular-nums">
                    {systemMetrics.surfaceTemp.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-[#f9e2af]">°C</span>
                </div>
                <div className="text-[11px] text-[#9aa3c2]">Safe thermal zone (&lt;65°C max)</div>
              </div>
            </div>

            {/* Inverter Routing & Energy Flow Card */}
            <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#9aa3c2]">
                <span className="font-semibold text-[#dce3f7]">Energy Flow & Distribution</span>
                <span className="text-[11px]">Science Wing Phase 2</span>
              </div>
              <p className="text-xs text-[#dce3f7]/90 leading-relaxed">
                Solar power actively feeds daytime science building circuits. Surplus generation is buffered into the 48V backup battery bank for uninterrupted evening research operations.
              </p>
              <div className="pt-2 border-t border-[#3b4460]/50 flex items-center justify-between text-xs text-[#9aa3c2]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
                  <span>Main Inverter Feed: Active</span>
                </span>
                <span className="font-medium text-[#dce3f7] tabular-nums">
                  48V DC Nominal
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: CIRCUIT POWER BUDGET & ROOMS (7 cols / ~58%)     */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 bg-[#181b29] border border-[#3b4460]/80 rounded-xl p-5 flex flex-col gap-5 shadow-sm">
            {/* Header + Add Room Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3b4460]/60">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#dce3f7] tracking-tight">
                    Circuit Power Allocation
                  </h1>
                  <span className="text-xs text-[#fab387] font-semibold tabular-nums">
                    · Solar Feed: {systemMetrics.currentFluxRate.toFixed(1)} kW
                  </span>
                </div>
                <p className="text-xs text-[#9aa3c2] mt-1">
                  Manage active circuit power limits and balance laboratory workloads
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#272d40] border border-[#3b4460] text-[#dce3f7] hover:bg-[#323a52] hover:border-[#fab387] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#fab387]" />
                <span>Add Room</span>
              </button>
            </div>

            {/* Total Allocated Budget Section */}
            <div className="flex flex-col gap-3 pb-4 border-b border-[#3b4460]/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-semibold text-[#9aa3c2]">
                  Total Allocated Circuit Demand
                </span>
                <span className="font-semibold text-[#dce3f7] tabular-nums">
                  {totalAllocated.toFixed(1)} of {targetBudgetCap.toFixed(1)} kW{' '}
                  <span className={remainingReserve >= 0 ? 'text-[#a6e3a1]' : 'text-[#f38ba8]'}>
                    ({remainingReserve >= 0 ? `${remainingReserve.toFixed(1)} kW available reserve` : `${Math.abs(remainingReserve).toFixed(1)} kW over capacity`})
                  </span>
                </span>
              </div>

              {/* Progress Gauge */}
              <div className="w-full bg-[#0f111a] h-3 rounded-full border border-[#3b4460] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverAllocated ? 'bg-[#f38ba8]' : 'bg-[#fab387]'
                  }`}
                  style={{ width: `${Math.min(100, allocatedPct)}%` }}
                />
              </div>

              {/* Cap / Target Slider */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-[#9aa3c2] whitespace-nowrap">
                  Target Budget Cap:
                </span>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={targetBudgetCap}
                    onChange={(e) => setTargetBudgetCap(parseFloat(e.target.value))}
                    className="w-full"
                    aria-label="Target Cap Budget Slider"
                  />
                </div>
                <div className="px-2.5 py-1 bg-[#0f111a] border border-[#3b4460] rounded-md text-xs font-semibold text-[#dce3f7] tabular-nums min-w-[58px] text-center">
                  {targetBudgetCap.toFixed(1)} kW
                </div>
              </div>

              {/* Quick Schedule Presets */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs font-medium text-[#9aa3c2]">
                  Schedules:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    updateCircuit('c1', { allocatedKw: 1.2, isActive: true });
                    updateCircuit('c2', { allocatedKw: 1.8, isActive: true });
                    updateCircuit('c3', { allocatedKw: 0.6, isActive: true });
                    updateCircuit('c4', { allocatedKw: 0.5, isActive: true });
                    updateCircuit('c5', { allocatedKw: 0.6, isActive: true });
                    updateCircuit('c6', { allocatedKw: 0.5, isActive: true });
                    showToast("Standard daytime schedule restored (5.2 kW)");
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#0f111a] hover:bg-[#272d40] border border-[#3b4460] text-[#dce3f7] text-xs font-medium transition-colors cursor-pointer"
                >
                  Standard Day (5.2 kW)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateCircuit('c1', { allocatedKw: 0.6, isActive: true });
                    updateCircuit('c2', { allocatedKw: 1.2, isActive: true });
                    updateCircuit('c3', { allocatedKw: 0.6, isActive: true });
                    updateCircuit('c4', { allocatedKw: 0.5, isActive: true });
                    updateCircuit('c5', { allocatedKw: 0.3, isActive: true });
                    updateCircuit('c6', { allocatedKw: 0.3, isActive: true });
                    showToast("Eco energy-saver schedule applied (3.5 kW)");
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#0f111a] hover:bg-[#272d40] border border-[#3b4460] text-[#a6e3a1] text-xs font-medium transition-colors cursor-pointer"
                >
                  Eco Energy-Saver (3.5 kW)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateCircuit('c1', { allocatedKw: 0.0, isActive: false });
                    updateCircuit('c2', { allocatedKw: 0.8, isActive: true });
                    updateCircuit('c3', { allocatedKw: 1.0, isActive: true });
                    updateCircuit('c4', { allocatedKw: 0.8, isActive: true });
                    updateCircuit('c5', { allocatedKw: 0.0, isActive: false });
                    updateCircuit('c6', { allocatedKw: 0.0, isActive: false });
                    showToast("Priority-only lab lock engaged (2.6 kW)");
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#0f111a] hover:bg-[#272d40] border border-[#f9e2af]/40 text-[#f9e2af] text-xs font-medium transition-colors cursor-pointer"
                >
                  Priority Labs Only (2.6 kW)
                </button>
              </div>
            </div>

            {/* Circuit Feed Sliders List */}
            <div className="flex flex-col divide-y divide-[#3b4460]/40">
              {circuits.map((room) => {
                const isPriority = room.type === 'Priority';
                const descriptionMap: Record<string, string> = {
                  'Classroom': 'Classroom 101 · Smart lighting, AV projector & ventilation',
                  'Lab Computer': 'Computer Lab · 24 workstations & local server rack',
                  'Lab Electronics': 'Electronics Workbench · Oscilloscopes & test equipment',
                  'Lab Chemical': 'Chemistry Lab · Fume hoods & temperature-controlled storage',
                  'Lab Sound & Video': 'Media Studio · Recording consoles & audio isolation',
                  'Lab Light Machinery': 'Fabrication Space · 3D printers & light bench power',
                };
                const equipmentNote = descriptionMap[room.name] || 'Custom laboratory circuit feed';

                return (
                  <div key={room.id} className="py-3.5 flex flex-col gap-2.5">
                    {/* Room Meta Line */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[#dce3f7]">
                            {room.name}
                          </span>

                          {isPriority ? (
                            <span className="text-xs font-medium text-[#f9e2af] flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 text-[#f9e2af]" />
                              <span>Priority Circuit (Protected)</span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#9aa3c2]">
                              Standard
                            </span>
                          )}

                          <span className="text-[#3b4460]">·</span>

                          <span className="text-xs text-[#9aa3c2] flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                room.isActive ? 'bg-[#a6e3a1]' : 'bg-[#9aa3c2]'
                              }`}
                            />
                            <span>{room.isActive ? 'Connected' : 'Offline'}</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9aa3c2]">
                          {equipmentNote}
                        </span>
                      </div>

                      {/* Right controls: Active toggle + Delete */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={room.isActive}
                          onClick={() => updateCircuit(room.id, { isActive: !room.isActive })}
                          title={room.isActive ? `Disconnect ${room.name}` : `Connect ${room.name}`}
                          className={`relative inline-flex h-5 w-9 items-center shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ${
                            room.isActive
                              ? 'bg-[#212638] border border-[#a6e3a1]/60'
                              : 'bg-[#141724] border border-[#3b4460]'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full shadow-sm transform transition-transform duration-200 ${
                              room.isActive ? 'translate-x-4 bg-[#a6e3a1]' : 'translate-x-0.5 bg-[#9aa3c2]'
                            }`}
                          />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => deleteCircuit(room.id)}
                          title={`Remove ${room.name} circuit`}
                          className="p-1.5 text-[#9aa3c2] hover:text-[#f38ba8] hover:bg-[#272d40] rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Slider + Power Stepper Row */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0.0"
                          max="3.0"
                          step="0.1"
                          disabled={!room.isActive}
                          value={room.allocatedKw}
                          onChange={(e) =>
                            updateCircuit(room.id, {
                              allocatedKw: parseFloat(e.target.value),
                            })
                          }
                          className={`w-full ${!room.isActive ? 'opacity-30 cursor-not-allowed' : ''}`}
                          aria-label={`Power allocation for ${room.name}`}
                        />
                      </div>

                      {/* Numeric Readout & Fine-Tuning Steppers */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={!room.isActive || room.allocatedKw <= 0}
                          onClick={() =>
                            updateCircuit(room.id, {
                              allocatedKw: Math.max(0, Math.round((room.allocatedKw - 0.1) * 10) / 10),
                            })
                          }
                          className="w-6 h-6 rounded bg-[#0f111a] hover:bg-[#272d40] border border-[#3b4460] text-[#dce3f7] text-xs flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          -
                        </button>

                        <div className="px-2.5 py-1 bg-[#0f111a] border border-[#3b4460] rounded-md text-xs font-semibold text-[#dce3f7] tabular-nums min-w-[56px] text-center">
                          {room.allocatedKw.toFixed(1)} kW
                        </div>

                        <button
                          type="button"
                          disabled={!room.isActive || room.allocatedKw >= 4.0}
                          onClick={() =>
                            updateCircuit(room.id, {
                              allocatedKw: Math.min(4.0, Math.round((room.allocatedKw + 0.1) * 10) / 10),
                            })
                          }
                          className="w-6 h-6 rounded bg-[#0f111a] hover:bg-[#272d40] border border-[#3b4460] text-[#dce3f7] text-xs flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <AddRoomModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
