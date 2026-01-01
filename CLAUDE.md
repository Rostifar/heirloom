# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Heirloom is a terminal-based pomodoro timer built using React/Ink for the CLI interface. It tracks focus sessions, manages interruptions, and provides statistics on productivity.

**Platform Note:** macOS only. Notifications rely on native macOS AppleScript (`osascript`). Non-macOS platforms fall back to console logging.

## Development Commands

```bash
# Build the project (TypeScript compilation)
npm run build

# Development mode with watch
npm run dev

# Run the CLI locally (after building)
npm start

# Or use the binary directly
node dist/cli.js <command>
```

## Architecture

### Core Data Flow

1. **Session Lifecycle**: Sessions flow through `SessionManager` → `storage` → filesystem
   - Active sessions are singleton (only one active session allowed at a time)
   - Sessions transition: `active` → `completed` or `interrupted`
   - All timestamps stored as ISO strings, durations in minutes

2. **Storage Layer** (`src/lib/storage.ts`):
   - Sessions persisted to `~/.config/heirloom/sessions.json` (macOS/Linux) or `%APPDATA%/heirloom/sessions.json` (Windows)
   - File created automatically on first use
   - Structure: `{ sessions: Session[] }`

3. **Command Architecture** (`src/commands/`):
   - Each command is a React component rendered via Ink
   - Commands use `SessionManager` for state management
   - `start` command sets up SIGINT handler to mark session as interrupted on Ctrl+C

### Key Components

**SessionManager** (`src/lib/session-manager.ts`):
- `createSession()`: Validates no active session exists before creating
- `completeSession()`: Marks session complete when timer finishes
- `interruptSession()`: Calculates actual duration based on elapsed time
- `getCurrentSession()`: Returns active session if one exists

**Timer** (`src/components/Timer.tsx`):
- React component with 1-second interval updates
- Takes duration in seconds, calls `onComplete` when finished
- Self-cleaning via useEffect cleanup

**Statistics** (`src/lib/statistics.ts`):
- All stats calculated over trailing 30 days from current date
- Success rate = completed sessions / total non-active sessions
- Used by history command for reporting

**Notifications** (`src/lib/notifications.ts`):
- macOS: Uses `osascript -e 'display notification...'` with "Glass" sound
- Non-macOS: Console output only

### TypeScript Configuration

- ES2022 target with ESNext modules
- Strict mode enabled with additional strictness flags:
  - `noUnusedLocals`, `noUnusedParameters`
  - `noFallthroughCasesInSwitch`
  - `noUncheckedIndexedAccess`
- JSX configured for React (not React JSX transform)
- Module resolution: `bundler` (Node.js ESM with .js extensions in imports)

### File Extensions

- All imports use `.js` extensions even though source files are `.ts`/`.tsx`
- This is required for ESM compatibility in Node.js
- The TypeScript compiler maps `.js` imports to `.ts` source files during compilation

## Testing Focus Mode Notifications

For users with macOS Focus modes (Work, Do Not Disturb):
- Notifications require allowing "Script Editor" in System Settings → Focus → [Mode] → Apps
- Without this, notifications will be silenced during Focus sessions
