import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MAX_HISTORY = 5;
const DATA_DIR = join(process.cwd(), "data");
const HISTORY_FILE = join(DATA_DIR, "search-history.json");

type HistoryData = { byIp: Record<string, string[]> };

/**
 * History is stored in a JSON file so it persists across restarts when the app
 * runs on a server with a writable disk. On serverless (e.g. Vercel) the
 * filesystem may be read-only or ephemeral — callers should handle errors and
 * fall back to localStorage or empty.
 */
export async function readHistoryFromFile(ip: string): Promise<string[]> {
  try {
    const raw = await readFile(HISTORY_FILE, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object" || !("byIp" in data)) return [];
    const byIp = (data as HistoryData).byIp;
    if (!byIp || typeof byIp !== "object") return [];
    const list = byIp[ip];
    return Array.isArray(list) ? list.slice(0, MAX_HISTORY).filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function appendHistoryToFile(ip: string, ingredients: string): Promise<string[]> {
  if (!ingredients.trim()) return readHistoryFromFile(ip);
  const trimmed = ingredients.trim();
  try {
    await mkdir(DATA_DIR, { recursive: true });
    let data: HistoryData = { byIp: {} };
    try {
      const raw = await readFile(HISTORY_FILE, "utf-8");
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && "byIp" in parsed && typeof (parsed as HistoryData).byIp === "object") {
        data = parsed as HistoryData;
      }
    } catch {
      // file missing or invalid
    }
    const normalized = trimmed.toLowerCase();
    const prev = (data.byIp[ip] ?? []).filter((s) => s.trim().toLowerCase() !== normalized);
    const next = [trimmed, ...prev].slice(0, MAX_HISTORY);
    data.byIp[ip] = next;
    await writeFile(HISTORY_FILE, JSON.stringify(data, null, 2), "utf-8");
    return next;
  } catch {
    return readHistoryFromFile(ip);
  }
}
