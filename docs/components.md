# 🧩 Components Outline

The React components are structured carefully to keep state lifted only when necessary, predominantly resolving around `<App>` as the global event orchestrator.

## Core Visual Engines
1. **`DealFloor.jsx`**: The core graph. Maps `nodesRef` to DOM tiles and `linksRef` to SVG paths. Attaches `d3` physics behaviors and scales the parent container using `d3.zoom`.
2. **`CapitalTile.jsx`**: The individual interactive tile. Extends `framer-motion`'s `<motion.div>`. Manages its visual CSS scaling based on its `weight` property and triggers selection side-effects.

## Contextual Overlays (UI)
1. **`Minimap.jsx`**: Bottom-right HUD. Performs inverse coordinate mathematical transforms against the `d3.zoom` object to correctly project the tracked bounds across the dynamic floor.
2. **`ControlStrip.jsx`**: Floating left-navbar toggling cluster states, filter menus, and resets.
3. **`TopSearch.jsx`**: Top-center fuzzy-match input. Reads from the dynamic `investors` prop provided by `App.jsx`. Offers autocomplete click-throughs or an "Enter to drop" callback (`onSummon`).
4. **`FilterMenu.jsx`**: Nested next to the `ControlStrip`, renders an actionable modal to ghost out non-affiliated nodes. **Architecture Note:** It enforces strict 1:1 data alignment by syncing with the physics sectors defined in `DealFloor`.
5. **`NegotiationSidebar.jsx`**: High-contrast slide-in panel. Dynamically displays **Strategic Capital Mass** (total deployed) and **Sector Alignment** (tags) using live database properties. Features a "Network Intelligence" section that generates context-aware dossiers.

## Workflows
1. **`EntityOnboarding.jsx`**: A high-fidelity animation sequence that simulates data extraction from a provided LinkedIn URL. **Live Feature:** It successfully generates a new investor identity and performs a real-time `MERGE` write to the Neo4j Cloud, instantly populating the Deal Floor on completion.
2. **`ErrorBoundary.jsx`**: Wraps `<DealFloor>` strictly to catch complex UI math failures or runtime `d3` issues without killing the outer React DOM. Also handles graceful UI states for Database Connection Failures.
