## 7) Practical Notes for Developers

- Keep field names (`name`) stable after launch to avoid breaking existing saved meta.
- Treat builder config and runtime data separately:
  - Config: schema and structure (`wp_options`)
  - Runtime: entered content (`postmeta`, `termmeta`, `usermeta`, or options-page slug option)
- Prefer native WordPress APIs for reads/writes to preserve compatibility with WordPress core behavior.

---
