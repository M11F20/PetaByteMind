<div align="center">
  <img src="./public/assets/hud-banner.svg" alt="PetaByteMind Cinematic IDE HUD Banner" width="100%" />
</div>

# PetaByteMind // The Cinematic IDE & Systems Portfolio

> **"The Engineer as a Filmmaker."**  
> A dark-mode, cinematic Integrated Development Environment (IDE) merged with a non-linear video editor (DaVinci Resolve meets Linear and Bloomberg Terminal).

---


## Architecture & Workspaces

The application is structured around a persistent IDE Viewport Shell hosting four dedicated workspaces:

1. **`01 CMD` (The Command Center)**
   - **Hero Viewport**: 16:9 cinematic cyber-physical monitor with live SVG HUD displaying frame rate (`60.0 FPS`), SMPTE running timecode, broadcast safe-area guides, chapter scrubbers, and playback controls.
   - **Interactive System Topology**: Interactive SVG / canvas node graph interconnecting the 4 content pillars: *Systems Philosophy*, *Full-Stack Architecture*, *Vibe-Coding*, and *Hardware Mechanics*.
   - **Telemetry Inspector**: Real-time sidecar inspector reporting complexity score, measured latency benchmarks, and runtime stacks.

2. **`02 VAULT` (The Knowledge Vault)**
   - Complexity Filter bar (`00 ALL`, `01 Vibe-Coding Primer` → `02 Full-Stack Arch` → `03 Systems Design` → `04 Silicon Limits`).
   - Interactive 4-stage architecture pipeline (Kernel Bus `io_uring` → SIMD Dedup `AVX-512` → Raft Consensus Ring → Agent Dispatch `Tree-sitter`).
   - Timestamped kernel code snapshot cards with copyable source snippets.

3. **`03 DOSSIER` (The Engineering Dossier)**
   - Tailored for North American graduate admissions committees (Stanford, MIT, CMU, Berkeley) and Principal R&D Labs.
   - Systems Case Study Blueprints with empirical problem statements and measured benchmarks (P99 latency, L3 cache miss reductions, DRAM compaction).
   - Filterable IEEE / ACM publications archive with citations, preprint links, and DOI metadata.

4. **`04 NETWORK` (The Global Network)**
   - Gated Slack intake pipeline protocol (`@handle` verification, specialty clusters, regional gateway routing).
   - Active trans-regional corridor build spotlights connecting builders across the MENA region and North America (Baghdad ↔ Toronto ↔ Boston ↔ Dubai ↔ Cairo).

---

## Design System & Token Discipline

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Void Charcoal** | `#0B0E11` | Global base canvas and deepest viewport layer |
| **Graphite UI** | `#1F2428` | Compartments, cards, panels, structural elevation |
| **Border Slate** | `#2D333B` | Exposed 1px solid structural grid lines |
| **Muted Ash** | `#8B949E` | Secondary metadata, coordinates, low-priority telemetry |
| **Pure Signal** | `#F0F6FC` | Primary headings, code, and high-contrast typography |
| **Hyper Cyan** | `#34D3D5` | **<5% strict discipline**: Active states, triggers, cursors |

- **Zero Softness**: Explicit `rounded-none` geometry with visible 1px compartment borders and corner coordinate ticks (`SYS.01 // [X:1920, Y:1080]`).
- **Dual-Direction Grid Engine**: Built exclusively with CSS Logical Properties (`border-inline-start`, `ms-*`, `me-*`, `ps-*`, `pe-*`) for seamless LTR (`en`) / RTL (`ar`) mirroring while keeping code, coordinates, and telemetry strictly in Latin/English monospace.

---

## Quickstart

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Keyboard Shortcuts
- `Cmd + K` or `Ctrl + K`: Open Command Palette / Dispatch Protocol
- `Esc`: Close Command Palette
s