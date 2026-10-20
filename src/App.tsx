/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './components/Header';
import { ConsoleView } from './components/ConsoleView';
import { TelemetryLogView } from './components/TelemetryLogView';
import { Footer } from './components/Footer';

const DashboardContent: React.FC = () => {
  const { activeView } = useTelemetry();

  return (
    <div className="min-h-screen flex flex-col bg-[#121221] text-[#e3e0f7] selection:bg-[#fab387]/20 selection:text-[#fab387]">
      <Header />
      <main className="w-full flex-1 pt-16 flex flex-col">
        {activeView === 'console' ? <ConsoleView /> : <TelemetryLogView />}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <TelemetryProvider>
      <DashboardContent />
    </TelemetryProvider>
  );
}
