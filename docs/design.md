# 🎨 Design & Styling Rules

The application utilizes strict Vanilla CSS with no CSS frameworks to ensure maximum control over the 2D layout engine.

## The Aesthetic
The application relies heavily on **Glassmorphism**, dark matte base palettes, and aggressive neon highlights mimicking a high-end trading terminal. Avoid generic plain backgrounds.

## Variables (`src/index.css`)
Global CSS tokens control the design system:
- `--color-bg`: `hsl(240 5% 4%)` (Deep graphite)
- `--color-surface`: `rgba(20, 20, 25, 0.7)` (Translucent base)
- `--color-border-light`: `rgba(255, 255, 255, 0.08)`
- `--color-accent-green`: `rgb(0, 255, 65)` (Neon tension)
- `--color-accent-gold`: `#f5d061`

## Styling Mechanics
- **The Capital Weight Shadow**: Elements project depth using extreme box shadows `box-shadow: 0 4px 20px ...`. The distance and spread of these shadows on Capital Tiles are mathematically tied to the investor's `weight` stat in the database.
- **Glass Panels**: Most UI overlays (Control Strip, Top Search, Sidebar) implement the `.glass-panel` utility class standardizing:
  - `backdrop-filter: blur(16px)`
  - Matte borders
  - Floating layouts hovering over the Deal Floor SVG layer.
- **Typography**: Uses `Inter` or standard Sans-serif for highly legible numeric strings. `letter-spacing: 12px` is used aggressively for the massive background Region Labels mapping the industry clusters to give it an architectural map aesthetic.
