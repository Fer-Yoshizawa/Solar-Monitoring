---
name: Solar Instrument Dashboard
colors:
  surface: '#313244'
  surface-dim: '#121221'
  surface-bright: '#383849'
  surface-container-lowest: '#0d0d1c'
  surface-container-low: '#1a1a2a'
  surface-container: '#1e1e2e'
  surface-container-high: '#292839'
  surface-container-highest: '#333344'
  on-surface: '#e3e0f7'
  on-surface-variant: '#d7c3b8'
  inverse-surface: '#e3e0f7'
  inverse-on-surface: '#2f2f40'
  outline: '#9f8d84'
  outline-variant: '#52443c'
  surface-tint: '#feb78a'
  primary: '#ffd7c0'
  on-primary: '#4f2504'
  primary-container: '#fab387'
  on-primary-container: '#764320'
  inverse-primary: '#87512d'
  secondary: '#99d595'
  on-secondary: '#00390c'
  secondary-container: '#19511f'
  on-secondary-container: '#88c384'
  tertiary: '#f3ddaa'
  on-tertiary: '#3c2f0b'
  tertiary-container: '#d6c190'
  on-tertiary-container: '#5e4e28'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#feb78a'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#6b3a18'
  secondary-fixed: '#b4f2af'
  secondary-fixed-dim: '#99d595'
  on-secondary-fixed: '#002205'
  on-secondary-fixed-variant: '#19511f'
  tertiary-fixed: '#f7e0ad'
  tertiary-fixed-dim: '#dac493'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#54451f'
  background: '#121221'
  on-background: '#e3e0f7'
  surface-variant: '#333344'
  surface-border: '#45475A'
  text-main: '#CDD6F4'
  text-subtext: '#A6ADC8'
  solar-peach: '#FAB387'
  status-green: '#A6E3A1'
  warning-yellow: '#F9E2AF'
  danger-red: '#F38BA8'
typography:
  display-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-lg-bold:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
  body-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-numeric:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a high-precision, low-glare dashboard interface modeled after physical laboratory instrumentation panels. It prioritizes utilitarian calm over marketing flair, serving technicians and school facility engineers who need immediate situational clarity and precise operational control.

### Design Philosophy
- **Instrument Panel Tactility:** Controls read unmistakably as mechanical devices—recessed toggle tracks, calibrated horizontal slider bars, and physical dividing rules.
- **Utilitarian Restraint:** Visual noise is eliminated. Shadows, gradients, decorative iconography, and floating card layers are omitted in favor of structural precision and high legibility.
- **Cognitive Calm:** Using low-glare dark surfaces with warm, soft pastel identifiers ensures zero eye strain during prolonged monitoring sessions in dim laboratory environments.

## Colors

The palette is derived directly from the Catppuccin Mocha aesthetic, optimized for anti-glare operation in dim environments. Strict semantic boundaries apply to every chromatic accent:

- **Primary (`#FAB387` Peach):** Strictly reserved for solar generation, capacity gauges, active energy level sliders, and keyboard focus states. It universally signals "power direct from the sun."
- **Secondary (`#A6E3A1` Green):** Operational health indicators, monitor active toggles, and verified nominal bounds.
- **Tertiary (`#F9E2AF` Yellow):** Priority circuit allocations and advisory warning banners (such as low production rates).
- **Danger (`#F38BA8` Red):** Critical interruptions, battery depletion under threshold, connection drops, and allocation lockouts.
- **Neutrals (`#1E1E2E` Base, `#313244` Surface, `#45475A` Surface Border):** Architectural ground layers. Pure blacks (`#000000`) and pure whites (`#FFFFFF`) are strictly forbidden to eliminate harsh contrast.

## Typography

The design system standardizes on Atkinson Hyperlegible Next for extreme readability at distance and on industrial monitors. 

### Implementation Rules
- **Tabular Numerics:** All quantitative readings, power figures, metric labels, and timestamps must render with `font-variant-numeric: tabular-nums` to prevent horizontal jittering across automatic refresh cycles.
- **Casing:** Use standard sentence case across all section titles and technical labels. All-caps treatments and uppercase tracked eyebrows are prohibited to maintain a clinical, understated tone.
- **Dynamic Scale:** The live output read-out leverages `display-xl` (48px) on desktop viewpoints, scaling down to 36px on mobile viewports to prevent line-wrapping.

## Layout & Spacing

The system implements a functional 2-column asymmetric layout prioritizing instant visual readouts on the left and interactive operational controls on the right.

### Breakpoints & Flow
- **Desktop (1024px+):** Fixed 2-column split layout separated by a vertical structural divider. The left column (Live Output) occupies a 40% width footprint, while the right column (Room Allocations) spans the remaining 60%.
- **Tablet (600px to 1023px):** Collapses into a single stacked column. Live telemetry metrics position directly above the room management table with a horizontal dividing border.
- **Mobile (&lt;600px):** Single-column layout. Inputs and controls expand to 100% width. A persistent, sticky summary bar anchors to the bottom viewport displaying real-time allocation status.

### Metric Rules
Layout boundaries rely entirely on standardized gutters and empty space padding. Section divisions must use structural 1px lines (`--surface-border`) instead of drop shadows or ambient depth cues.

## Elevation & Depth

This system intentionally eliminates traditional z-axis elevation, drop shadows, and blurred skeuomorphism. It mimics calibrated flat metal instrumentation through surface grounding and hairline boundary definition.

### Depth Conventions
- **Surface Hierarchy:** The foundation canvas sits on `base` (`#1E1E2E`). Interactive groups, input trays, and track beds reside on `surface` (`#313244`).
- **Hairline Boundary:** Separation is achieved using 1px flat structural dividers in `#45475A`. 
- **Recessed Well Technique:** Sliders, meter channels, and switch tracks appear embedded into the panel through high-contrast structural borders rather than inset shadow mechanics.
- **Zero Shadows:** Elevation tokens are strictly omitted. No card or overlay should cast drop shadows or ambient ambient lighting cones onto neighboring modules.

## Shapes

The design system utilizes subtle, restrained corner roundings (`roundedness: 1`, baseline 4px / `0.25rem`) that reflect machined industrial hardware rather than consumer app bubbles.

- **Base Components:** Input fields, metric status blocks, and interactive cards strictly adhere to a 4px border radius.
- **Structural Bars:** Progress tracks and slider channels maintain a 4px soft radius.
- **Toggle Switches:** Physical switches and status tags adopt pill formatting (`9999px`) to immediately convey binary hardware state.

## Components

### Buttons
- **Primary / Add Room:** Flat `#313244` background with a 1px border in `#45475A`, text styled in `#CDD6F4`. Minimum tap area of 44x44px. Hover state shifts background to `#45475A`. Focus requires a 3px solid `#FAB387` outline with 2px offset.
- **Priority Indicator Buttons:** Unselected state displays a subdued 1px outline in `#45475A` with `#A6ADC8` text; active state highlights with a `#F9E2AF` border and text.

### Sliders (Energy Allocation)
- **Track:** 8px height, rounded at 4px, filled with `#1E1E2E` inset inside a 1px `#45475A` border.
- **Active Fill:** Solid `#FAB387` spanning from origin to the active threshold.
- **Thumb Control:** 24x24px rounded-full control in `#CDD6F4` with a 2px `#1E1E2E` inset center ring. Responds smoothly to standard horizontal drag and keyboard arrow navigation.

### Switches (Monitor & Room Toggles)
- **Track:** 28px height, 52px width, pill-shaped (`border-radius: 9999px`), rendered in `#1E1E2E` with a 1px `#45475A` perimeter.
- **Handle:** 20px circular knob. In the `off` position, shifts left and colors `#A6ADC8`. In the `on` position, shifts right and turns `#A6E3A1`.

### Data Gauges & Meter Bars
- **Output Capacity Bar:** 12px height horizontal bar on `#1E1E2E`. Fill color is `#FAB387`, animating smoothly over 200ms when telemetry updates (disabled when `prefers-reduced-motion` is active).

### Numeric Input Fields
- **Container:** Rectangular input box, 44px height, styled with `#1E1E2E` background and 1px `#45475A` border. Text uses `label-numeric` in `#CDD6F4`. Right-aligned unit suffix (`kW`) in `#A6ADC8`.

### Status Message Banners
- **Layout:** Full-width strip sitting directly beneath the header or sticky above the mobile footer. Background is `#1E1E2E` framed with a 1px solid border matching the status color (`#F9E2AF` for warnings, `#F38BA8` for errors). Accompanied by descriptive text explaining corrective actions.