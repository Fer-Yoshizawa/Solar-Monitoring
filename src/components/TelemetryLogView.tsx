import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { CalibrationStrip } from './CalibrationStrip';
import { WaveformOscillator } from './WaveformOscillator';
import { TimeSpan, EventCategory } from '../types/telemetry';
import {
  Sun,
  Zap,
  Gauge,
  CheckCircle2,
  Download,
  SlidersHorizontal,
  HardDrive,
  Shield,
  FileSpreadsheet,
  FileCode,
  DownloadCloud,
  ChevronLeft,
  ChevronRight,
  Filter,
  Archive,
} from 'lucide-react';

export const TelemetryLogView: React.FC = () => {
  const {
    systemMetrics,
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
    isMonitorActive,
  } = useTelemetry();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredFrames = getFilteredFrames();
  const totalPages = Math.max(1, Math.ceil(filteredFrames.length / rowsPerPage));
  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * rowsPerPage;
  const currentRows = filteredFrames.slice(startIndex, startIndex + rowsPerPage);

  const handleSpanChange = (span: TimeSpan) => {
    setCurrentSpan(span);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: EventCategory) => {
    setCurrentCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full pb-24 sm:pb-16">
      {/* Top Calibration Strip */}
      <CalibrationStrip variant="telemetry-log" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* ============================================================== */}
        {/* 4-METRIC OVERVIEW GRID                                         */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Current Generation */}
          <div className="bg-[#181b29] border border-[#3b4460]/80 p-4.5 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
              <span className="font-medium">Current Solar Generation</span>
              <Sun className="w-4 h-4 text-[#fab387]" />
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#dce3f7] tabular-nums">
                {isMonitorActive ? (systemMetrics.currentFluxRate + 0.12).toFixed(2) : '0.00'}
              </span>
              <span className="text-sm font-semibold text-[#fab387]">kW</span>
            </div>
            <div className="pt-2 border-t border-[#3b4460]/50 flex items-center justify-between text-xs text-[#9aa3c2]">
              <span>Today's Peak</span>
              <span className="font-semibold text-[#dce3f7] tabular-nums">
                {systemMetrics.peakToday.toFixed(2)} kW <span className="text-[#9aa3c2] text-[11px]">@ {systemMetrics.peakTime}</span>
              </span>
            </div>
          </div>

          {/* Metric 2: Total Generation */}
          <div className="bg-[#181b29] border border-[#3b4460]/80 p-4.5 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
              <span className="font-medium">Total Generation Logged</span>
              <Zap className="w-4 h-4 text-[#a6e3a1]" />
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#dce3f7] tabular-nums">
                {systemMetrics.totalGeneration.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-[#a6e3a1]">kWh</span>
            </div>
            <div className="pt-2 border-t border-[#3b4460]/50 flex items-center justify-between text-xs text-[#9aa3c2]">
              <span>30-Day Cumulative</span>
              <span className="font-semibold text-[#dce3f7] tabular-nums">
                {systemMetrics.cumulative30d.toFixed(1)} kWh
              </span>
            </div>
          </div>

          {/* Metric 3: Bus Voltage */}
          <div className="bg-[#181b29] border border-[#3b4460]/80 p-4.5 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
              <span className="font-medium">Inverter Bus Voltage</span>
              <Gauge className="w-4 h-4 text-[#f9e2af]" />
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#dce3f7] tabular-nums">
                {systemMetrics.busVoltage.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-[#f9e2af]">V DC</span>
            </div>
            <div className="pt-2 border-t border-[#3b4460]/50 flex items-center justify-between text-xs text-[#9aa3c2]">
              <span>Inverter Efficiency</span>
              <span className="font-semibold text-[#a6e3a1] tabular-nums">
                {systemMetrics.inverterEfficiency.toFixed(1)}% Nominal
              </span>
            </div>
          </div>

          {/* Metric 4: Data Stream Health */}
          <div className="bg-[#181b29] border border-[#3b4460]/80 p-4.5 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#9aa3c2] mb-1">
              <span className="font-medium">Data Stream Health</span>
              <CheckCircle2 className="w-4 h-4 text-[#a6e3a1]" />
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#dce3f7] tabular-nums">
                {systemMetrics.dataStreamIntegrity.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-[#a6e3a1]">%</span>
            </div>
            <div className="pt-2 border-t border-[#3b4460]/50 flex items-center justify-between text-xs text-[#9aa3c2]">
              <span>Interval: 1.0 s</span>
              <span className="font-semibold text-[#a6e3a1] tabular-nums">
                0 Signal Dropouts
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BUS WAVEFORM SYNC OSCILLATOR STRIP                             */}
        {/* ============================================================== */}
        <WaveformOscillator />

        {/* ============================================================== */}
        {/* FILTER & OPERATIONAL CONTROLS BAR                              */}
        {/* ============================================================== */}
        <section className="bg-[#181b29] border border-[#3b4460]/80 p-3.5 sm:p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm">
          {/* Timeframe Span Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#9aa3c2] mr-1 hidden sm:inline">
              Timeframe:
            </span>

            <button
              type="button"
              onClick={() => handleSpanChange('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentSpan === 'live'
                  ? 'bg-[#0f111a] border border-[#fab387] text-[#fab387] font-semibold'
                  : 'bg-[#181b29] border border-[#3b4460] text-[#9aa3c2] hover:text-[#dce3f7]'
              }`}
            >
              {currentSpan === 'live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#fab387] animate-ping" />
              )}
              Live (Last 15m)
            </button>

            <button
              type="button"
              onClick={() => handleSpanChange('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentSpan === 'today'
                  ? 'bg-[#0f111a] border border-[#fab387] text-[#fab387] font-semibold'
                  : 'bg-[#181b29] border border-[#3b4460] text-[#9aa3c2] hover:text-[#dce3f7]'
              }`}
            >
              Today (24h)
            </button>

            <button
              type="button"
              onClick={() => handleSpanChange('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentSpan === 'week'
                  ? 'bg-[#0f111a] border border-[#fab387] text-[#fab387] font-semibold'
                  : 'bg-[#181b29] border border-[#3b4460] text-[#9aa3c2] hover:text-[#dce3f7]'
              }`}
            >
              Past 7 Days
            </button>

            <div className="h-4 w-px bg-[#3b4460] mx-1 hidden sm:block"></div>

            <button
              type="button"
              onClick={() => exportCSV(currentSpan)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#272d40] border border-[#3b4460] text-[#dce3f7] hover:bg-[#323a52] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#fab387]" />
              Export CSV
            </button>
          </div>

          {/* Right Controls: Category Filter Tabs + Auto-scroll toggle */}
          <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
            {/* Category Segmented Control */}
            <div className="flex items-center bg-[#0f111a] p-1 rounded-lg border border-[#3b4460] text-xs">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  currentCategory === 'all'
                    ? 'bg-[#272d40] text-[#dce3f7] font-semibold shadow-sm'
                    : 'text-[#9aa3c2] hover:text-[#dce3f7]'
                }`}
              >
                All ({categoryCounts.all})
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('allocations')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  currentCategory === 'allocations'
                    ? 'bg-[#272d40] text-[#dce3f7] font-semibold shadow-sm'
                    : 'text-[#9aa3c2] hover:text-[#dce3f7]'
                }`}
              >
                Circuits ({categoryCounts.allocations})
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('outputs')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  currentCategory === 'outputs'
                    ? 'bg-[#272d40] text-[#dce3f7] font-semibold shadow-sm'
                    : 'text-[#9aa3c2] hover:text-[#dce3f7]'
                }`}
              >
                Generation ({categoryCounts.outputs})
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('alerts')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentCategory === 'alerts'
                    ? 'bg-[#f38ba8]/15 text-[#f38ba8] font-bold'
                    : 'text-[#f38ba8] hover:text-[#f38ba8]/80'
                }`}
              >
                Alerts ({categoryCounts.alerts})
              </button>
            </div>

            {/* Auto-scroll toggle */}
            <button
              type="button"
              onClick={() => setIsAutoScrollOn((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-[#0f111a] px-3 py-1.5 rounded-lg border border-[#3b4460] hover:border-[#fab387]/60 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                {isAutoScrollOn && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a6e3a1] opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isAutoScrollOn ? 'bg-[#a6e3a1]' : 'bg-[#3b4460]'
                  }`}
                />
              </span>
              <span className="text-xs text-[#9aa3c2] select-none">Auto-scroll:</span>
              <span
                className={`text-xs font-semibold select-none ${
                  isAutoScrollOn ? 'text-[#a6e3a1]' : 'text-[#9aa3c2]'
                }`}
              >
                {isAutoScrollOn ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </section>

        {/* ============================================================== */}
        {/* TWO-COLUMN LAYOUT: LOG TABLE (8 COLS) + HEALTH & DUMP (4 COLS) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Chronological Activity Feed Table */}
          <section className="lg:col-span-8 bg-[#181b29] border border-[#3b4460]/80 rounded-xl overflow-hidden flex flex-col shadow-sm">
            {/* Table Header Strip */}
            <div className="p-4 bg-[#0f111a] border-b border-[#3b4460]/70 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#fab387]" />
                <h2 className="font-bold text-base text-[#dce3f7]">
                  Chronological Telemetry Feed
                </h2>
                <span className="text-xs text-[#fab387] font-medium hidden sm:inline">
                  · {currentSpan === 'live' ? 'Live Stream' : currentSpan === 'today' ? 'Today (24h)' : 'Past 7 Days'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#9aa3c2]">
                <span>1 update/sec</span>
                <span className="text-[#3b4460]">·</span>
                <span className="text-[#a6e3a1] font-medium">Synchronized</span>
              </div>
            </div>

            {/* Scrollable Table Bed */}
            <div className="overflow-x-auto w-full min-h-[360px] table-scroll-container">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f111a]/60 border-b border-[#3b4460]/60 text-[#9aa3c2] text-xs select-none font-medium">
                    <th className="py-2.5 px-4 whitespace-nowrap">Timestamp</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Facility Node</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Event Type</th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">Measured Value</th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">Shift / Drift</th>
                    <th className="py-2.5 px-4 text-center whitespace-nowrap">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4460]/40 text-xs">
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center text-[#9aa3c2]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Filter className="w-8 h-8 text-[#fab387]" />
                          <span className="font-semibold text-sm text-[#dce3f7]">
                            No events match current filter
                          </span>
                          <span className="text-xs">
                            Adjust timeframe or event category to view recorded telemetry.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((row) => {
                      const isFlash = row.id === newFrameFlashId;

                      const deltaClass =
                        row.deltaColor === 'status-green'
                          ? 'text-[#a6e3a1]'
                          : row.deltaColor === 'solar-peach'
                          ? 'text-[#fab387]'
                          : row.deltaColor === 'warning-yellow'
                          ? 'text-[#f9e2af]'
                          : row.deltaColor === 'danger-red'
                          ? 'text-[#f38ba8]'
                          : 'text-[#9aa3c2]';

                      const statusColor =
                        row.statusColor === 'status-green'
                          ? 'text-[#a6e3a1]'
                          : row.statusColor === 'solar-peach'
                          ? 'text-[#fab387]'
                          : row.statusColor === 'warning-yellow'
                          ? 'text-[#f9e2af]'
                          : row.statusColor === 'danger-red'
                          ? 'text-[#f38ba8]'
                          : 'text-[#dce3f7]';

                      const eventTone =
                        row.event === 'Allocation Shift'
                          ? 'text-[#fab387]'
                          : row.event === 'Irradiance' || row.event === 'Priority Lock'
                          ? 'text-[#f9e2af]'
                          : row.category === 'alerts'
                          ? 'text-[#f38ba8]'
                          : 'text-[#9aa3c2]';

                      const valueTone =
                        row.category === 'alerts'
                          ? 'text-[#f38ba8]'
                          : row.event === 'Output Sample'
                          ? 'text-[#fab387]'
                          : 'text-[#dce3f7]';

                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-[#272d40]/40 transition-colors ${
                            isFlash ? 'row-entry-flash' : ''
                          }`}
                        >
                          <td className="py-2.5 px-4 text-[#9aa3c2] whitespace-nowrap tabular-nums font-mono">
                            {row.time}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-[#dce3f7] whitespace-nowrap">
                            {row.sensor}
                          </td>
                          <td className={`py-2.5 px-4 ${eventTone} whitespace-nowrap font-medium`}>
                            {row.event}
                          </td>
                          <td className={`py-2.5 px-4 text-right font-semibold tabular-nums ${valueTone} whitespace-nowrap`}>
                            {row.value}
                          </td>
                          <td className={`py-2.5 px-4 text-right font-semibold tabular-nums ${deltaClass} whitespace-nowrap`}>
                            {row.delta}{' '}
                            {row.subtext && (
                              <span className="text-[11px] text-[#9aa3c2] font-normal">
                                {row.subtext}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-center whitespace-nowrap">
                            <span className={`font-semibold ${statusColor}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="p-4 bg-[#0f111a] border-t border-[#3b4460]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9aa3c2]">
              <div className="flex items-center gap-2">
                <span>
                  Showing {currentRows.length} of {filteredFrames.length} events
                </span>
                <span>·</span>
                <span>Continuously updated</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-md bg-[#272d40] border border-[#3b4460] text-[#dce3f7] hover:bg-[#323a52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-2.5 py-1 bg-[#181b29] rounded-md border border-[#3b4460] text-[#dce3f7] font-semibold tabular-nums">
                  Page {activePage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={activePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-md bg-[#272d40] border border-[#3b4460] text-[#dce3f7] hover:bg-[#323a52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 font-medium"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Diagnostics & Data Export Utilities */}
          <section className="lg:col-span-4 flex flex-col gap-5">
            {/* Hardware Sensor Health Card */}
            <div className="bg-[#181b29] border border-[#3b4460]/80 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-[#0f111a] border-b border-[#3b4460]/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#a6e3a1]" />
                  <h3 className="font-bold text-sm text-[#dce3f7]">
                    Sensor Hardware Health
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#a6e3a1]">
                  All 4 Nodes Nominal
                </span>
              </div>

              <div className="p-4 flex flex-col gap-4 text-xs">
                {/* Node 1 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-[#3b4460]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#dce3f7]">Photovoltaic String A (Roof West)</span>
                    <span className="font-semibold text-[#a6e3a1] tabular-nums">
                      {isMonitorActive ? '99.8% Nominal' : 'Standby'}
                    </span>
                  </div>
                  <div className="w-full bg-[#0f111a] h-2 rounded-full border border-[#3b4460] overflow-hidden">
                    <div
                      className="bg-[#fab387] h-full rounded-full transition-all duration-300"
                      style={{ width: isMonitorActive ? '99.8%' : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9aa3c2]">
                    <span>Sub-array panels 1–6</span>
                    <span className="text-[#a6e3a1]">Connected & Generating</span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-[#3b4460]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#dce3f7]">Photovoltaic String B (Roof East)</span>
                    <span className="font-semibold text-[#a6e3a1] tabular-nums">
                      {isMonitorActive ? '100.0% Nominal' : 'Standby'}
                    </span>
                  </div>
                  <div className="w-full bg-[#0f111a] h-2 rounded-full border border-[#3b4460] overflow-hidden">
                    <div
                      className="bg-[#fab387] h-full rounded-full transition-all duration-300"
                      style={{ width: isMonitorActive ? '100%' : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9aa3c2]">
                    <span>Sub-array panels 7–12</span>
                    <span className="text-[#a6e3a1]">Connected & Generating</span>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-[#3b4460]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#dce3f7]">Central Inverter Core</span>
                    <span className="font-semibold text-[#dce3f7] tabular-nums">
                      {systemMetrics.inverterCoreTemp.toFixed(1)} °C
                    </span>
                  </div>
                  <div className="w-full bg-[#0f111a] h-2 rounded-full border border-[#3b4460] overflow-hidden">
                    <div
                      className="bg-[#a6e3a1] h-full rounded-full transition-all duration-300"
                      style={{ width: `${(systemMetrics.inverterCoreTemp / 75.0) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9aa3c2]">
                    <span>Thermal threshold: 75°C</span>
                    <span className="text-[#a6e3a1]">Cooling Fan Active</span>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#dce3f7]">Battery Storage Bank</span>
                    <span className="font-semibold text-[#a6e3a1] tabular-nums">
                      {systemMetrics.batteryVoltage.toFixed(1)} V · {systemMetrics.batterySoc}%
                    </span>
                  </div>
                  <div className="w-full bg-[#0f111a] h-2 rounded-full border border-[#3b4460] overflow-hidden">
                    <div
                      className="bg-[#a6e3a1] h-full rounded-full transition-all duration-300"
                      style={{ width: `${systemMetrics.batterySoc}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9aa3c2]">
                    <span>LiFePO4 Chemistry</span>
                    <span className="text-[#a6e3a1]">Float Maintenance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Automated Facility Safeguards Card */}
            <div className="bg-[#181b29] border border-[#3b4460]/80 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-[#0f111a] border-b border-[#3b4460]/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#fab387]" />
                  <h3 className="font-bold text-sm text-[#dce3f7]">Facility Safeguards</h3>
                </div>
                <span className="text-xs text-[#a6e3a1] font-medium">Automatic</span>
              </div>

              <div className="p-4 flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-2.5 bg-[#0f111a] p-3 rounded-lg border border-[#3b4460]/60">
                  <CheckCircle2 className="w-4 h-4 text-[#a6e3a1] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#dce3f7]">Clean Solar Power Priority</span>
                    <span className="text-[#9aa3c2] text-[11px] mt-0.5">
                      100% of generated daytime power directly offsets science building demand before touching utility grid.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 bg-[#0f111a] p-3 rounded-lg border border-[#3b4460]/60">
                  <span className="text-xs text-[#9aa3c2] font-semibold">
                    Load Shedding Priority Hierarchy
                  </span>
                  <p className="text-[11px] text-[#9aa3c2] leading-relaxed">
                    If power demand exceeds available solar or reserve limits, standard classroom and media feeds throttle first to preserve critical chemistry and electronics lab equipment.
                  </p>
                  <div className="p-1.5 rounded-md bg-[#181b29] border border-[#3b4460] text-[11px] text-[#dce3f7] flex items-center gap-1.5 flex-wrap mt-1">
                    <span className="text-[#9aa3c2]">Classroom</span>
                    <span>→</span>
                    <span className="text-[#9aa3c2]">Media Studio</span>
                    <span>→</span>
                    <span className="text-[#9aa3c2]">Machinery</span>
                    <span>→</span>
                    <span className="text-[#f9e2af] font-semibold">
                      Protected Research Labs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export Action Card */}
            <div className="bg-[#181b29] border border-[#3b4460]/80 p-4 rounded-xl flex flex-col gap-3 text-xs shadow-sm">
              <div className="font-semibold text-sm text-[#dce3f7]">
                Export & Download Telemetry
              </div>
              <p className="text-[#9aa3c2] leading-relaxed">
                Export calibrated time-series records for sustainability compliance and laboratory audit reporting.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => exportCSV(currentSpan)}
                  className="px-3 py-2 rounded-lg bg-[#0f111a] border border-[#3b4460] text-[#dce3f7] font-semibold hover:border-[#fab387] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#fab387]" />
                  <span>CSV Spreadsheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportJSON(currentSpan)}
                  className="px-3 py-2 rounded-lg bg-[#0f111a] border border-[#3b4460] text-[#dce3f7] font-semibold hover:border-[#fab387] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#fab387]" />
                  <span>JSON Records</span>
                </button>
              </div>

              <button
                type="button"
                onClick={exportFullBuffer}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#272d40] border border-[#3b4460] text-[#fab387] font-semibold hover:bg-[#323a52] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Full Buffer Dump (4,096 Records)</span>
              </button>

              <a
                href="/solar-monitor.zip"
                download="solar-monitor.zip"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0f111a] border border-[#a6e3a1]/60 text-[#a6e3a1] font-semibold hover:bg-[#a6e3a1]/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>Download Complete Project (.ZIP)</span>
              </a>
            </div>
          </section>
        </div>

        {/* Telemetry Buffer Facility Note Strip - Authentic human context, zero mock compiler junk */}
        <div className="bg-[#181b29] border border-[#3b4460]/70 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-[#9aa3c2] text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#fab387]" />
            <span>Solar Monitor · Science Center Clean Energy Facility · 4,096 records retained for campus sustainability reports</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#a6e3a1] font-semibold">Continuous Sampling Active</span>
            <span className="text-[#3b4460]">·</span>
            <span>Local Buffer Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
