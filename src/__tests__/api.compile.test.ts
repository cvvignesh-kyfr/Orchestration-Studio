import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/compile/route";
import * as fs from "fs";

// Mock the fs module completely
vi.mock("fs", () => {
  return {
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn()
  };
});

describe("/api/compile API Route Tests", () => {
  it("should compile successfully with a full valid request body", async () => {
    const mockBody = {
      primitives: {
        warmth: { id: "warmth", base: 0.72 },
        humor: { id: "humor", base: 0.30 },
        assertiveness: { id: "assertiveness", base: 0.45 }
      },
      segments: [
        { id: "seg_english", name: "English Speakers", category: "demographic", rules: [], modifiers: { warmth: 0.10 } }
      ],
      governanceShields: [
        { id: "shield_warmth", name: "Warmth Cap", targetPrimitiveId: "warmth", limitType: "cap", thresholdValue: 0.50, condition: "always" }
      ],
      forbiddenBehaviors: [
        { id: "loneliness_exploitation", description: "Zero loneliness exploitation", category: "emotional_harm", isActive: true }
      ],
      illegalCombinations: [],
      strategies: [],
      organizations: [],
      tools: [],
      artifacts: []
    };

    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify(mockBody)
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.logs).toBeDefined();
    expect(data.logs.length).toBeGreaterThan(0);
    expect(data.compiledFiles).toBeDefined();
    expect(data.compiledFiles["runtime_manifest.yaml"]).toBeDefined();
    expect(data.compiledFiles["global_defaults.yaml"]).toBeDefined();
    
    // Check save calls
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should compile successfully with an empty request body using defaults", async () => {
    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify({})
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.logs.length).toBeGreaterThan(0);
  });

  it("should contain pipeline log message containing compiled word", async () => {
    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify({})
    });

    const res = await POST(req);
    const data = await res.json();

    const compiledLogs = data.logs.filter((l: string) => l.toLowerCase().includes("compiled") || l.toLowerCase().includes("pipeline"));
    expect(compiledLogs.length).toBeGreaterThan(0);
  });

  it("should contain the correct number of primitives in compiled global_defaults.yaml", async () => {
    const mockBody = {
      primitives: {
        warmth: { id: "warmth", base: 0.72 },
        humor: { id: "humor", base: 0.30 },
        assertiveness: { id: "assertiveness", base: 0.45 }
      }
    };

    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify(mockBody)
    });

    const res = await POST(req);
    const data = await res.json();
    const defaultsYaml = data.compiledFiles["global_defaults.yaml"];
    
    expect(defaultsYaml).toContain("warmth: 0.72");
    expect(defaultsYaml).toContain("humor: 0.30");
    expect(defaultsYaml).toContain("assertiveness: 0.45");
  });

  it("should contain segment IDs in compiled segments.yaml", async () => {
    const mockBody = {
      segments: [
        { id: "seg_1", name: "Segment 1", category: "demographic", rules: [], modifiers: {} },
        { id: "seg_2", name: "Segment 2", category: "behavioral", rules: [], modifiers: {} }
      ]
    };

    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify(mockBody)
    });

    const res = await POST(req);
    const data = await res.json();
    const segmentsYaml = data.compiledFiles["segments.yaml"];

    expect(segmentsYaml).toContain('id: "seg_1"');
    expect(segmentsYaml).toContain('id: "seg_2"');
  });

  it("should contain forbidden behavior ID in prohibitions.yaml when active", async () => {
    const mockBody = {
      forbiddenBehaviors: [
        { id: "no_slang_in_crisis", description: "Zero slang in crisis", category: "safety", isActive: true }
      ]
    };

    const req = new Request("http://localhost/api/compile", {
      method: "POST",
      body: JSON.stringify(mockBody)
    });

    const res = await POST(req);
    const data = await res.json();
    const prohibitionsYaml = data.compiledFiles["prohibitions.yaml"];

    expect(prohibitionsYaml).toContain('id: "no_slang_in_crisis"');
    expect(prohibitionsYaml).toContain('enabled: true');
  });

  it("should handle error gracefully and return 500 when request body parser throws", async () => {
    const badReq = {} as unknown as Request;

    const res = await POST(badReq);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});
