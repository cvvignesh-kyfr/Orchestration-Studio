# KYFR Platform: Behavioral & Governance Orchestration Studio

The **KYFR Platform** is a behavioral control panel and compilation engine for the **Adaptive Orchestration Engine (AOE)**. It empowers engineering, product, marketing, and safety squads to configure, test, simulate, and compile deterministic conversational and behavioral parameters designed for downstream Large Language Model (LLM) agents.

---

## 🚀 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI Engine**: React 19
- **State Architecture**: Zustand 5 (composed modular slices)
- **Typing Engine**: TypeScript 5
- **Design System**: Vanilla CSS for maximum flexibility and premium custom aesthetics
- **Test Suite**: Vitest (jsdom, testing-library)

---

## 📖 Deep-Dive Architecture & Guidelines

Explore our complete technical specifications for details on internals, configurations, and core designs:

1. 📂 [System Architecture & Data Flows](file:///Users/cvvignesh/Documents/Adaptive%20Orchestration%20Engine/Marketing/docs/ARCHITECTURE.md) — Directory specifications, resolution cascades, data paths.
2. 🧬 [Linguistic & Safety Primitives Spec](file:///Users/cvvignesh/Documents/Adaptive%20Orchestration%20Engine/Marketing/docs/PRIMITIVES.md) — Complete 25+ base primitives, HSL color tokens, bounds.
3. 💾 [State Management & Zustand API Reference](file:///Users/cvvignesh/Documents/Adaptive%20Orchestration%20Engine/Marketing/docs/STORE.md) — Store composition, slice actions, state boundaries.
4. ⚙️ [Compiler Outputs & Schemas Blueprint](file:///Users/cvvignesh/Documents/Adaptive%20Orchestration%20Engine/Marketing/docs/COMPILER.md) — YAML schema shapes, manifest hierarchies, API endpoints.

---

## 🛠️ CLI Operations

### 1. Launch the Development Server
Starts the Next.js development server on local port `1234` (or standard Next port if configured):
```bash
npm run dev
```

### 2. Run the Behavioral Compiler Pipeline
Validates current configurations against safety constraints and compiles deterministic YAML/JSON schemas directly into the `/runtime`, `/schemas`, and `/manifests` folders:
```bash
npm run compile-behavior
```

### 3. Run the Vitest Suite
Executes unit tests covering resolution cascade traces, composed store mutations, compiler API endpoints, registry validations, and recursive YAML serializers:
```bash
npm test
```
*To watch files and run tests on change:*
```bash
npx vitest
```

### 4. Run Linter
Validates code style and ensures 100% type safety with zero warnings or errors:
```bash
npm run lint
```

### 5. Build for Production
Creates a fully optimized production bundle under Next.js Turbopack:
```bash
npm run build
```
