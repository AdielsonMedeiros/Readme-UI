# Readme-UI: Development Roadmap 🚀

## Phase 1: The Foundation (Current Status: ✅ Initiated)
- [x] Project Initialization (Next.js 14, Tailwind, TypeScript)
- [x] Integrate `@vercel/og` & Satori Engine
- [x] Create Template Registry Pattern
- [x] Implement "Spotify Glassmorphism" Template
- [x] Build Live Playground MVP

## Phase 2: Dynamic Capabilities (Next 48h)
- [ ] **External API Integration:** Add server-side fetching in `route.tsx` to pull real data (Spotify Now Playing, GitHub User Stats) instead of static params.
- [ ] **Theme Support:** Allow passing `?theme=dark|light|dracula` to templates.
- [ ] **Response Caching:** Implement HTTP caching headers (`Cache-Control`) to avoid hitting limits.

## Phase 3: The Marketplace (Week 1)
- [ ] **Community Submission:** Create a PR workflow for users to submit `.tsx` templates.
- [ ] **Gallery Page:** Grid view of all available templates.
- [ ] **Interactive Config:** Auto-generate configuration forms based on Template Prop Types.

## Phase 4: Pro Features (Future)
- [ ] **Animated SVG:** Use CSS animations within Satori where supported.
- [ ] **Analytics:** Track views per widget key.
- [ ] **Auth:** Save user configurations.
