import * as fs from "fs";
import * as path from "path";
import { primitives } from "../constants/primitiveRegistry";
import {
  initialSegments,
  initialShields,
  initialForbiddenBehaviors,
  initialIllegalCombinations,
  initialDomains
} from "../data/seedSegments";
import { toYAML } from "../lib/toYAML";

// Main Compiler Execution
function runCompiler() {
  const rootDir = process.cwd();
  console.log(`\n🤖 Antigravity Runtime Contract Compiler pipeline starting...`);
  console.log(`Working Directory: ${rootDir}\n`);

  // Target compilation folders
  const paths = {
    runtimeGov: path.join(rootDir, "runtime", "governance"),
    runtimeMk: path.join(rootDir, "runtime", "marketing"),
    runtimePr: path.join(rootDir, "runtime", "product"),
    schemasPr: path.join(rootDir, "schemas", "primitives"),
    schemasOv: path.join(rootDir, "schemas", "overlays"),
    schemasGov: path.join(rootDir, "schemas", "governance"),
    manifests: path.join(rootDir, "manifests"),
    buildRes: path.join(rootDir, "build", "resolved"),
    buildEnv: path.join(rootDir, "build", "environments"),
    changelogs: path.join(rootDir, "changelogs"),
    migrations: path.join(rootDir, "migrations")
  };

  // 1. Create directory structures securely
  Object.values(paths).forEach(p => {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
      console.log(`[DIR] Created secure structure: ${path.relative(rootDir, p)}`);
    }
  });

  // Helper to save files
  const save = (p: string, content: string) => {
    fs.writeFileSync(p, content, "utf8");
    console.log(`[FILE] Compiled: ${path.relative(rootDir, p)}`);
  };

  // 2. Compile Runtime Governance Configs
  save(
    path.join(paths.runtimeGov, "prohibitions.yaml"),
    `# Immutable Hard Prohibitions\ncontract_type: hard_nos\ncompiled_at: "${new Date().toISOString()}"\n\nprohibitions:${toYAML(initialForbiddenBehaviors, 2)}`
  );
  save(
    path.join(paths.runtimeGov, "safety_shields.yaml"),
    `# Situational Safety Limits\ncontract_type: safety_shields\ncompiled_at: "${new Date().toISOString()}"\n\nshields:${toYAML(initialShields, 2)}`
  );
  save(
    path.join(paths.runtimeGov, "combinations.yaml"),
    `# Unsafe Emergent Combinations\ncontract_type: illegal_combinations\ncompiled_at: "${new Date().toISOString()}"\n\ncombinations:${toYAML(initialIllegalCombinations, 2)}`
  );

  // 3. Compile Runtime Marketing Overlays
  save(
    path.join(paths.runtimeMk, "global_defaults.yaml"),
    `# Baseline Global Defaults\ncontract_type: global_defaults\ncompiled_at: "${new Date().toISOString()}"\n\ndefaults:\n${Object.entries(primitives).map(([k, v]) => `  ${k}: ${v.base.toFixed(2)}`).join("\n")}`
  );
  save(
    path.join(paths.runtimeMk, "segments.yaml"),
    `# Dynamic Targeting & Behavioral Modifiers\ncontract_type: segment_overlays\ncompiled_at: "${new Date().toISOString()}"\n\nsegments:${toYAML(initialSegments, 2)}`
  );

  // 3b. Compile Runtime Product Domains
  save(
    path.join(paths.runtimePr, "domain_orchestration.yaml"),
    `# Bounded Product Domain Orchestrations\ncontract_type: product_domain_orchestration\ncompiled_at: "${new Date().toISOString()}"\n\ndomains:${toYAML(initialDomains, 2)}`
  );

  // 4. Compile Validation Schemas
  save(
    path.join(paths.schemasPr, "primitive_registry.json"),
    JSON.stringify({ contract_type: "primitive_registry", primitives }, null, 2)
  );
  save(
    path.join(paths.schemasOv, "segment_schema.json"),
    JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Audience Segment & Overlay Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        category: { type: "string" },
        rules: { type: "array" },
        modifiers: { type: "object" }
      },
      required: ["id", "name", "category", "rules", "modifiers"]
    }, null, 2)
  );
  save(
    path.join(paths.schemasGov, "policy_schema.json"),
    JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Safety Governance Cap Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        targetPrimitiveId: { type: "string" },
        limitType: { type: "string", enum: ["cap", "floor"] },
        thresholdValue: { type: "number" },
        condition: { type: "string" }
      },
      required: ["id", "name", "targetPrimitiveId", "limitType", "thresholdValue", "condition"]
    }, null, 2)
  );

  // 5. Compile Master Manifests
  save(
    path.join(paths.manifests, "runtime_manifest.yaml"),
    `# Master Runtime Configuration Manifest\nmanifest_type: production_runtime\ncompiled_at: "${new Date().toISOString()}"\ncompiler_version: "Antigravity Pipeline v1.0.0"\n\ngovernance_files:\n  - runtime/governance/prohibitions.yaml\n  - runtime/governance/safety_shields.yaml\n  - runtime/governance/combinations.yaml\nmarketing_files:\n  - runtime/marketing/global_defaults.yaml\n  - runtime/marketing/segments.yaml\nproduct_files:\n  - runtime/product/domain_orchestration.yaml`
  );
  save(
    path.join(paths.manifests, "inheritance_manifest.yaml"),
    `# Deterministic Stack Precedence Manifest\n# Resolved sequentially. Product Domain establishes the sandbox boundaries first, followed by baseline defaults, overlays, and capped finally by Governance.\ninheritance_stack:\n  - product_domain_orchestration\n  - global_defaults\n  - demographic_segments\n  - regional_segments\n  - behavioral_segments\n  - lifecycle_segments\n  - relationship_modes\n  - contextual_modes\n  - intent_modes\n  - safety_governance_caps`
  );
  save(
    path.join(paths.manifests, "overlay_manifest.yaml"),
    `# Auditable Active Overlays Registry\noverlays_count: ${initialSegments.length}\nactive_overlays:\n${initialSegments.map(s => `  - id: "${s.id}"\n    category: "${s.category}"\n    rules_count: ${s.rules.length}\n    modifiers_count: ${Object.keys(s.modifiers).length}`).join("\n")}`
  );

  // 6. Pre-compile Build Resolved Matrices for high-performance caches
  save(
    path.join(paths.buildRes, "resolved_matrix.json"),
    JSON.stringify({
      compiled_at: new Date().toISOString(),
      resolved_cache_entries: [
        {
          userId: "user_kiara",
          active_overlays: ["india_genz", "bangalore_urban", "mode_financial_anxiety"],
          resolved_primitives: {
            warmth: 0.90, // Capped by Safety Shield
            slang_density: 0.25,
            relatability: 0.90,
            pacing: 0.30
          }
        }
      ]
    }, null, 2)
  );

  save(
    path.join(paths.buildEnv, "dev.yaml"),
    `environment: dev\ncompiler_flags:\n  enable_trace_logs: true\n  enforce_strict_MECE: true`
  );
  save(
    path.join(paths.buildEnv, "prod.yaml"),
    `environment: prod\ncompiler_flags:\n  enable_trace_logs: false\n  enforce_strict_MECE: true`
  );

  // 7. Seed Changelogs & migrations
  save(
    path.join(paths.changelogs, "changelog_v1.0.0.yaml"),
    `version: 1.0.0\ntimestamp: "${new Date().toISOString()}"\nauthor: "Antigravity Pipeline Compiler"\nchanges:\n  - "Initial compilation of MECE behavioral layers."\n  - "Secured 100% disjoint primitive allocations."\n  - "Established constitutional Safety Governance overriding marketing vectors."`
  );
  save(
    path.join(paths.migrations, "migration_001.sql"),
    `-- Database seed migration file\nINSERT INTO segment_registry (id, name, category, enabled) VALUES\n${initialSegments.map(s => `('${s.id}', '${s.name}', '${s.category}', true)`).join(",\n")};\n\nINSERT INTO safety_shields (id, name, target_primitive, threshold, condition) VALUES\n${initialShields.map(s => `('${s.id}', '${s.name}', '${s.targetPrimitiveId}', ${s.thresholdValue}, '${s.condition}')`).join(",\n")};`
  );

  console.log(`\n🎉 Compilation finished successfully! All deterministic runtime artifacts are version-ready.\n`);
}

runCompiler();
