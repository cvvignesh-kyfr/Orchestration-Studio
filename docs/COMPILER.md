# Specification: Statically & Dynamically Compiled Artifacts

This document details the compile outputs, targets, structures, dynamic API contracts, and command-line execution instructions for the behavioral compiler engine.

---

## 1. Compiler Output Manifest Reference

When the compiler executes (via the CLI pipeline or `/api/compile` server endpoint), it generates a structured folder matrix containing deterministic configuration files:

| Folder | File Path | Format | Purpose |
| :--- | :--- | :--- | :--- |
| **`runtime/governance`** | `prohibitions.yaml` | YAML | Flagged system behaviors strictly banned from execution in production. |
| | `safety_shields.yaml` | YAML | Situational caps and floors evaluated at runtime context. |
| | `combinations.yaml` | YAML | Anti-pattern checks for conflicting primitives. |
| **`runtime/marketing`** | `global_defaults.yaml` | YAML | Default flat base values for all resolved primitives. |
| | `segments.yaml` | YAML | Target rules and modifiers mapping per segment block. |
| **`runtime/product`** | `journeys.yaml` | YAML | Structured product journeys, capabilities constraints, and journey-level primitive offsets. |
| | `tools.yaml` | YAML | Registry of dynamic capabilities and tools SLA metrics. |
| | `artifacts.yaml` | YAML | Output artifacts definitions and mutability lifecycle contracts. |
| | `strategies.yaml` | YAML | Behavioral strategy rules, target modifiers, and explainability targets. |
| | `organizations.yaml`| YAML | Ownership mapping outlining which product squads own which primitive paths. |
| **`schemas/primitives`** | `primitive_registry.json`| JSON | Master validation schema containing constraints for all primitives. |
| **`manifests`** | `runtime_manifest.yaml`| YAML | Compiled index mapping all active runtime configuration files. |
| | `inheritance_manifest.yaml`| YAML | Deterministic stack precedence defining step priority order. |
| **`build/resolved`** | `resolved_matrix.json` | JSON | Simulated snapshot maps containing pre-calculated resolved values for active test suites. |
| **`migrations`** | `migration_001.sql` | SQL | Standard SQL statements seeding compiled store registries directly into the production database. |

---

## 2. Running the Compiler CLI

To trigger static validation and compilation in your terminal:
```bash
npm run compile-behavior
```
*Behind the scenes, this executes `npx tsx src/compiler/compile.ts`, which reads baseline data directly from local registries, validates constraints, and writes all production YAML files to the directory root.*

---

## 3. Dynamic Compilation Endpoint: `/api/compile`

The web control panel compiles configurations dynamically by dispatching store records to the API route handler:

### A. HTTP Request Payload (`POST /api/compile`)
```json
{
  "primitives": {
    "warmth": { "id": "warmth", "base": 0.72, "path": "global_foundation.tone.warmth" }
  },
  "segments": [
    {
      "id": "gen_z_demographic",
      "name": "Gen Z Users",
      "category": "demographic",
      "rules": [{ "field": "age", "operator": "less_than", "value": "26" }],
      "modifiers": { "warmth": 0.10 }
    }
  ],
  "governanceShields": [],
  "forbiddenBehaviors": [],
  "illegalCombinations": [],
  "strategies": [],
  "organizations": [],
  "tools": [],
  "artifacts": []
}
```

### B. HTTP Response Structure
```json
{
  "success": true,
  "logs": [
    "🤖 Antigravity Runtime Contract Compiler pipeline starting...",
    "✓ [FILE] Compiled: runtime/governance/prohibitions.yaml",
    "🎉 Compilation finished successfully! All deterministic runtime artifacts are version-ready."
  ],
  "manifest": "# Master Runtime Configuration Manifest...",
  "compiledFiles": {
    "runtime_manifest.yaml": "# Master Runtime...",
    "global_defaults.yaml": "# Baseline Global Defaults..."
  }
}
```

---

## 4. How to Add a New Compiled Output File

To include a new output target in the compilation pipeline (e.g., `runtime/product/experiments.yaml`):

1. **Open** `src/app/api/compile/route.ts` (for the API path) and `src/compiler/compile.ts` (for the CLI path).
2. **Add** the target path to the `paths` dictionary:
   ```ts
   const paths = {
     ...
     runtimeExp: path.join(rootDir, "runtime", "experiments")
   };
   ```
3. **Execute** the `save` function to serialize your data:
   ```ts
   save(
     path.join(paths.runtimeExp, "experiments.yaml"),
     `# Active Live Experiments\ncompiled_at: "${new Date().toISOString()}"\n\nexperiments:${toYAML(finalExperiments as unknown as YAMLValue, 2)}`
   );
   ```
4. **Append** the target relative path to the master manifest array so deployment scripts pick it up automatically.
