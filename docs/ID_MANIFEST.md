# 🗝️ ID Manifest & Schema Registry

This manifest serves as the "Source of Truth" for all semantic identifiers, data schemas, and relationship types used within the Investor Graph ecosystem. It is intended for both developers and AI agents to ensure data integrity during graph operations.

## 1. Entity Registry (`:Investor` Node)

| Property | Data Type | Description | Global Pattern |
|----------|-----------|-------------|----------------|
| `id` | `string` | Unique identifier used for D3/React mapping. | `i_{timestamp}` (e.g., `i_1712781451`) |
| `name` | `string` | Display name of the investor. | Full Title Case |
| `firm` | `string` | Primary investment vehicle or family office. | Proper Case |
| `weight` | `integer` | Physics mass and visual scale (4-12 range). | Unitless integer |
| `type` | `string` | Tier categorization for color indexing. | `elite`, `flow`, `passive` |
| `tags` | `string[]` | Sector affiliations. First tag drives clustering. | SaaS, Fintech, AI, etc. |
| `deployed` | `string` | Human-readable capital deployed. | `$100M+`, `$2.5B` |
| `education` | `string` | University background (backstage mapping). | Text |
| `pastExperience`| `string` | Career history (backstage mapping). | Text |

---

## 2. Relationship Registry

| Type | Semantic Meaning | UI Visual | `strength` Range |
|------|------------------|-----------|------------------|
| `SYNDICATE` | Joint investment in deals. | Primary Bold Path | `0.6 - 1.0` |
| `ALUMNI` | Shared academic background. | Thin Secondary Path | `0.2 - 0.4` |
| `CAREER` | Shared prior employment/firms. | Muted Dashed Path | `0.3 - 0.5` |

---

## 3. UI Component Selectors

These IDs and Classes are consistently used for automated event triggers and DOM targeting:

- **Main Floor**: `#deal-floor-svg` (The D3 container)
- **Selection Event**: `.capital-tile.selected`
- **Sidebar Portal**: `.negotiation-sidebar`
- **Onboarding Trigger**: `[data-action="onboard-entity"]`

---

## 4. Physics Constants (`DealFloor.jsx`)

- **Standard Gravity**: `-400` (Negative charge)
- **Sector Centers**: SaaS (Top Left), Fintech (Top Right), AI (Bottom Left), Deeptech (Bottom Right).
- **Collision Radius**: `distance * 1.5` based on `node.weight`.

---

> [!NOTE]
> This manifest is a living document. Any additions to the Neo4j schema OR new relationship types must be recorded here to prevent logic fragmentation.
