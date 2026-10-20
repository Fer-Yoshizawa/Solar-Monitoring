# Solar Monitor Dashboard

A dual-screen laboratory-grade solar power monitoring and circuit load allocation interface modeled after physical telemetry instrumentation.

## Features
- **Console View**: Live flux rate, panel array capacity gauge, daily total, battery reserve, pyranometer irradiance, thermal probes, dynamic circuit load sliders, and automated load shedding.
- **Telemetry Log View**: 4-metric overview grid, 60 FPS harmonic bus waveform sync oscillator, chronological FIFO stream table with real-time flash ingestion, hardware sensor health, and data extraction utilities (.CSV, .JSON, and full 4,096-frame buffer).
- **Responsive**: Fully optimized for desktop (40/60 split), tablet, and mobile (touch controls and sticky allocation summary bar).
- **Offline / Local Persistence**: Settings, circuit configurations, and telemetry frames persist via `localStorage`.

---

## Deploying to Vercel

This is a standard React + Vite + TypeScript application that deploys seamlessly to Vercel with zero configuration required.

### Option 1: Vercel CLI (Fastest)
1. Unzip the project and open terminal in the project directory:
   ```bash
   cd solar-monitor
   ```
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the terminal prompts (choose default settings: Framework `Vite`, output directory `dist`).

### Option 2: Vercel Dashboard (GitHub / GitLab)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Import your repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
