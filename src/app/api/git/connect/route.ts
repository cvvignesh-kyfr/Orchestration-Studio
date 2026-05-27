/* eslint-disable */
import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

async function runGit(args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await execFileAsync("git", args, { cwd });
  return { stdout: (stdout || "").trim(), stderr: (stderr || "").trim() };
}

function injectToken(repoUrl: string, token?: string, username?: string): string {
  if (!token || !repoUrl.startsWith("https://")) return repoUrl;
  const user = (username && username.trim()) || "x-access-token";
  const withoutProtocol = repoUrl.replace("https://", "");
  return `https://${encodeURIComponent(user)}:${encodeURIComponent(token)}@${withoutProtocol}`;
}

export async function POST(req: Request) {
  const rootDir = process.cwd();
  try {
    const body = await req.json().catch(() => ({}));
    const remote = typeof body.remote === "string" && body.remote.trim() ? body.remote.trim() : "origin";
    const repoUrl = typeof body.repoUrl === "string" ? body.repoUrl.trim() : "";
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";

    if (!repoUrl) {
      return NextResponse.json({ success: false, error: "Repository URL is required." }, { status: 400 });
    }

    const authenticatedUrl = injectToken(repoUrl, token, username);

    await runGit(["rev-parse", "--is-inside-work-tree"], rootDir);

    let hasRemote = true;
    try {
      await runGit(["remote", "get-url", remote], rootDir);
    } catch {
      hasRemote = false;
    }

    if (hasRemote) {
      await runGit(["remote", "set-url", remote, authenticatedUrl], rootDir);
    } else {
      await runGit(["remote", "add", remote, authenticatedUrl], rootDir);
    }

    await runGit(["ls-remote", "--heads", remote], rootDir);

    return NextResponse.json({
      success: true,
      remote,
      repoUrl,
      message: `Connected ${remote} to repository and verified remote access.`
    });
  } catch (error: any) {
    const errMsg = error?.stderr || error?.stdout || error?.message || "Failed to connect to remote repository.";
    return NextResponse.json({ success: false, error: String(errMsg).trim() }, { status: 500 });
  }
}
