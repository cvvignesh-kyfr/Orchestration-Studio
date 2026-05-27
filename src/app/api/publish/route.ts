import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const PUBLISH_TARGETS = [
  "runtime/governance/prohibitions.yaml",
  "runtime/governance/safety_shields.yaml",
  "runtime/governance/combinations.yaml",
  "runtime/marketing/global_defaults.yaml",
  "runtime/marketing/segments.yaml",
  "runtime/product/journeys.yaml",
  "runtime/product/strategies.yaml",
  "runtime/product/organizations.yaml",
  "runtime/product/tools.yaml",
  "runtime/product/artifacts.yaml",
  "manifests/runtime_manifest.yaml",
  "manifests/inheritance_manifest.yaml",
  "build/resolved/resolved_matrix.json",
  "migrations/migration_001.sql"
];

type GitCommandResult = {
  stdout: string;
  stderr: string;
};

async function runGit(args: string[], cwd: string): Promise<GitCommandResult> {
  const { stdout, stderr } = await execFileAsync("git", args, { cwd });
  return {
    stdout: (stdout || "").trim(),
    stderr: (stderr || "").trim()
  };
}

function injectToken(repoUrl: string, token?: string, username?: string): string {
  if (!token || !repoUrl.startsWith("https://")) return repoUrl;
  const user = (username && username.trim()) || "x-access-token";
  const withoutProtocol = repoUrl.replace("https://", "");
  return `https://${encodeURIComponent(user)}:${encodeURIComponent(token)}@${withoutProtocol}`;
}

export async function POST(req: Request) {
  const rootDir = process.cwd();
  const logs: string[] = [];

  try {
    const body = await req.json().catch(() => ({}));
    const commitMessage =
      typeof body.commitMessage === "string" && body.commitMessage.trim().length > 0
        ? body.commitMessage.trim()
        : "chore(simulation): publish runtime yaml bundle";
    const pushRemote =
      typeof body.remote === "string" && body.remote.trim().length > 0
        ? body.remote.trim()
        : "origin";
    const targetBranchInput =
      typeof body.branch === "string" && body.branch.trim().length > 0
        ? body.branch.trim()
        : "";
    const repoUrl =
      typeof body.repoUrl === "string" && body.repoUrl.trim().length > 0
        ? body.repoUrl.trim()
        : "";
    const gitToken =
      typeof body.token === "string" && body.token.trim().length > 0
        ? body.token.trim()
        : "";
    const gitUsername =
      typeof body.username === "string" && body.username.trim().length > 0
        ? body.username.trim()
        : "";

    logs.push("🚀 Starting git publishing pipeline...");
    logs.push(`📂 Workspace: ${rootDir}`);

    await runGit(["rev-parse", "--is-inside-work-tree"], rootDir);

    let hasHead = true;
    try {
      await runGit(["rev-parse", "--verify", "HEAD"], rootDir);
    } catch {
      hasHead = false;
    }

    let activeBranch = "main";
    if (hasHead) {
      const branchResult = await runGit(["rev-parse", "--abbrev-ref", "HEAD"], rootDir);
      activeBranch = branchResult.stdout || "main";
    } else {
      const symbolicRef = await runGit(["symbolic-ref", "--short", "HEAD"], rootDir).catch(() => ({ stdout: "main", stderr: "" }));
      activeBranch = symbolicRef.stdout || "main";
    }
    const targetBranch = targetBranchInput || activeBranch;
    logs.push(`🌿 Active branch: ${activeBranch}`);
    logs.push(`🎯 Push target: ${pushRemote}/${targetBranch}`);

    if (repoUrl) {
      const authenticatedUrl = injectToken(repoUrl, gitToken, gitUsername);
      let hasRemote = true;
      try {
        await runGit(["remote", "get-url", pushRemote], rootDir);
      } catch {
        hasRemote = false;
      }
      if (hasRemote) {
        await runGit(["remote", "set-url", pushRemote, authenticatedUrl], rootDir);
      } else {
        await runGit(["remote", "add", pushRemote, authenticatedUrl], rootDir);
      }
      logs.push(`🔗 Remote configured: ${pushRemote}`);
    }

    await runGit(["add", "-f", "--", ...PUBLISH_TARGETS], rootDir);
    logs.push(`$ git add -f ${PUBLISH_TARGETS.join(" ")}`);

    let hasChanges = true;
    try {
      await runGit(["diff", "--cached", "--quiet"], rootDir);
      hasChanges = false;
    } catch (error) {
      const err = error as { code?: number };
      if (err?.code !== 1) {
        throw error;
      }
    }

    if (!hasChanges) {
      logs.push("ℹ️ No runtime YAML changes detected after compilation.");
      return NextResponse.json({
        success: true,
        status: "no_changes",
        branch: targetBranch,
        logs
      });
    }

    logs.push(`$ git commit -m "${commitMessage}"`);
    const commitResult = await runGit(["commit", "-m", commitMessage], rootDir);
    if (commitResult.stdout) {
      logs.push(commitResult.stdout);
    }

    const commitHashResult = await runGit(["log", "-1", "--pretty=%h"], rootDir).catch(() => ({ stdout: "initial", stderr: "" }));
    const commitHash = commitHashResult.stdout || "initial";

    logs.push(`$ git push ${pushRemote} ${targetBranch}`);
    const pushResult = await runGit(["push", pushRemote, targetBranch], rootDir);
    if (pushResult.stdout) {
      logs.push(pushResult.stdout);
    }
    if (pushResult.stderr) {
      logs.push(pushResult.stderr);
    }

    logs.push(`✅ Published commit ${commitHash} to ${pushRemote}/${targetBranch}.`);

    return NextResponse.json({
      success: true,
      status: "published",
      branch: targetBranch,
      commitHash,
      logs
    });
  } catch (error) {
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const errMsg = err?.stderr || err?.stdout || err?.message || "Failed to publish runtime bundle to git.";
    logs.push(`❌ ${String(errMsg).trim()}`);
    return NextResponse.json(
      {
        success: false,
        status: "failed",
        error: String(errMsg).trim(),
        logs
      },
      { status: 500 }
    );
  }
}
