# Bootstrap Layout Guidance

**Layout preset:** `nextjs_root`  
**Authoritative paths:** `0_phase0_bootstrap/feature_flags.yml` → `components.web.directories`

## Actual repo layout

```
app/           # Next.js App Router pages
components/    # React components (incl. components/ui/ shadcn)
lib/           # Utilities (cn, etc.)
hooks/         # React hooks
public/        # Static assets
styles/        # Additional global styles
```

## Policy

- Do **not** move folders to `frontend/` without reopening DEC-0001.
- Prefer updating `MVP_SPECIFICATION.yaml` PROJECT_LAYOUT if layout changes.
- Architecture checks use paths from `feature_flags.yml`, not hardcoded monorepo defaults.

## Agent write paths

See `0_phase0_bootstrap/feature_flags.yml` → `permissions.write_to`.

Locked (proposal-only): `5_reference_architectures/`, `0_phase0_bootstrap/`.
