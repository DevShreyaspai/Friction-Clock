# Friction Clock

> Crush what slows you down.

A premium productivity tool that uses psychologically-calibrated micro-commitments to break through task avoidance. Built with a murdered-out aesthetic — black backgrounds, deep gray cards, white typography, and electric blue accents.

---

## Setup

```bash
# Clone the repository
git clone https://github.com/your-org/friction-clock.git
cd friction-clock

# Install dependencies
bun install

# Start the development server
bun run dev
```

Open the Preview Panel (or navigate to `localhost:3000`) to see the app.

### Requirements

- **Node.js** 18+ or **Bun** runtime
- No external database required — all state lives in the browser

---

## Core Features

### Friction Buster Engine

The central algorithm maps your resistance level (1–10) to a tiered psychological micro-commitment:

| Friction Range | Tier | Micro-Commitment |
|---|---|---|
| 1–4 | **Low** | Open your materials and review the absolute first page or line |
| 5–7 | **Moderate** | Close unrelated tabs, spend 60 seconds looking at the problem |
| 8–10 | **Extreme** | Type one single sentence or comment line — nothing else matters |

The engine intercepts your task name + friction rating and instantly generates an actionable, minimally-threatening first step. This bypasses the brain's threat-response loop that causes procrastination.

### Dopamine Shift Loop

A state-machine flow designed to convert avoidance energy into forward momentum:

1. **Calibrate** — Name the task, rate resistance 1–10
2. **2-Minute Micro-Commitment** — A low-stakes countdown timer with your personalized action step
3. **Victory** — The timer hits zero; hardest part is over
4. **Lock In** (optional) — Seamlessly escalate to a 20-minute deep work session
5. **Streak Reward** — Completed task logged with a checkmark; daily streak incremented

Each transition triggers a visual reward (glow effects, trophy animation, streak counter), reinforcing the dopamine pathway that makes starting the next task easier.

---

## Architecture

### Client-Side State Machine

Friction Clock runs as a **pure client-side state machine** with zero server round-trips during use:

- **State transitions** are instant — no network latency between the form → timer → victory → deep work views
- **Timer accuracy** uses `Date.now()` wall-clock references instead of `setInterval` counting, eliminating drift over long sessions
- **localStorage persistence** automatically syncs tasks and streak data on every state change, so a page refresh never loses progress
- **React hooks** (`useState`, `useRef`, `useCallback`, `useEffect`) manage all state with minimal re-renders

This architecture provides an **ultra-fast, zero-latency user experience** because:

1. Every interaction resolves in a single React render cycle — no async API calls block the UI
2. The timer updates at 200ms intervals with sub-second accuracy, creating buttery-smooth visual feedback
3. localStorage reads happen only on initial hydration; writes are fire-and-forget
4. The entire application ships as a single client component with no server-side data dependencies

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Icons | Lucide React |
| Persistence | Browser localStorage |

### File Structure

```
src/
├── app/
│   ├── page.tsx          # Entire application (single-file architecture)
│   ├── layout.tsx        # Root layout with fonts and metadata
│   └── globals.css       # Theme variables, animations, custom scrollbar
├── components/ui/        # shadcn/ui component library
└── lib/utils.ts          # Tailwind merge utility
```

---

## License

MIT
