# 🧩 Components Outline

The React components are structured carefully to keep state lifted only when necessary, predominantly resolving around `<App>` as the global event orchestrator.

## Core Visual Engines
1. **`DealFloor.jsx`**: The core graph. Maps `nodesRef` to DOM tiles and `linksRef` to SVG paths. Attaches `d3` physics behaviors and scales the parent container using `d3.zoom`.
2. **`CapitalTile.jsx`**: The individual interactive tile. Extends `framer-motion`'s `<motion.div>`. Manages its visual CSS scaling based on its `weight` property and triggers selection side-effects.

## Contextual Overlays (UI)
1. **`Minimap.jsx`**: Bottom-right HUD. Performs inverse coordinate mathematical transforms against the `d3.zoom` object to correctly project the tracked bounds.
2. **`ControlStrip.jsx`**: Floating left-navbar toggling cluster states, filter menus, and resets.
3. **`TopSearch.jsx`**: Top-center fuzzy-match input. Reads directly from the `mockEnvironment` dataset. Offers autocomplete click-throughs or an "Enter to drop" callback (`onSummon`).
4. **`FilterMenu.jsx`**: Nested next to the `ControlStrip`, renders an actionable modal to ghost out non-affiliated nodes. **Architecture Note:** It enforces strict 1:1 data alignment by importing `CLUSTER_CENTERS` directly from `DealFloor`, guaranteeing the filter strings precisely match the exact UI physics sectors. Features a fixed backdrop overlay for clean click-away dismissals.
5. **`NegotiationSidebar.jsx`**: Right-hand panel revealing node details (weight balance, thesis) when a tile is selected from the DealFloor.

## Workflows
1. **`EntityOnboarding.jsx`**: A standalone animation sequence component explicitly crafted to mimic a data-scraping workflow. Blurs the background layout and simulates loading metrics before a successful "add".
2. **`ErrorBoundary.jsx`**: Wraps `<DealFloor>` strictly to catch complex UI math failures or runtime `d3` issues without killing the outer React DOM, providing a crash prompt to the user.
