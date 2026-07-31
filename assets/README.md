# Assets (not served by Next)

| Path | Purpose |
|------|---------|
| `source/smb-sheets/` | Original SMB sprite sheets → `npm run gen:game-assets` |
| `source/smb-sfx/` | Original NES SFX wavs → copied into `public/sounds/` by gen |
| `source/certificates/` | PDF/source certs (converted images live in `public/images/certifications/`) |
| `preview/` | Dev-only renders (`npm run preview:level`, gen contact sheets) — never deployed |

Runtime/public files stay under `public/` only.
