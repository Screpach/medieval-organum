# Medieval Organum Generator - Architecture & Phasing

## Project Overview
This project is a 9-phase implementation of a medieval counterpoint generator (c. 850–1100). 
It follows a strict "No-Edit" policy: once a phase is complete, its source files are frozen.

## The 9-Phase Plan

1. **Infrastructure (Current)**: Project scaffold, build tools, folder layout.
2. **Domain Model**: `src/core` - Pure data structures (Note, Pitch, Mode) and theory utilities.
3. **Constraint Engine**: `src/core/rules` - Hard logic for isStepAllowed().
4. **Generator Logic**: `src/engine` - Heuristic scoring and backtracking search.
5. **Keyboard/Input**: `src/ui/inputs` - Piano UI with split accidentals.
6. **Modern Score**: `src/ui/scores/modern` - VexFlow rendering.
7. **Gregorian Score**: `src/ui/scores/gregorian` - Neume rendering and mapping.
8. **Audio/Playback**: `src/audio` - Web Audio/Tone.js engine with glissando support.
9. **Orchestration**: `src/app` - Main UI shell, state management, and wiring of all previous phases.

## Rules of Engagement

1. **Strict Separation**: Each phase owns specific directories.
2. **No Backward Edits**: Phase N cannot modify files created in Phase N-1.
3. **Extension Strategy**: If Phase N needs to modify behavior from Phase N-1, it must wrap the original module or create a new composition, not edit the source.
4. **Testing**: Each phase (where applicable) must include unit tests.

## Tech Stack
- **Framework**: React (for UI component management).
- **Build**: Webpack + Babel.
- **Audio**: Web Audio API (likely via Tone.js in Phase 8).
- **Notation**: VexFlow (Modern) + Custom Font/SVG (Gregorian).
