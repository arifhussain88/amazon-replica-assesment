#!/usr/bin/env node
/**
 * Automatic 8x assignment capture.
 * Fires from Cursor hooks (beforeSubmitPrompt, afterAgentResponse, stop).
 * Writes only the user prompt and the final agent response to .agent-logs/.
 */

const fs = require("fs");
const path = require("path");

const AUTHOR = "arifhussain88";
const TOOL = "cursor";
const PROJECT = "amazon-rebuild-8x";
const DEBUG_LOG = path.join(__dirname, "debug.log");

function nowIso() {
  return new Date().toISOString();
}

function debug(message, extra) {
  try {
    const line =
      `${nowIso()} ${message}` +
      (extra !== undefined ? ` ${safeJson(extra)}` : "") +
      "\n";
    fs.appendFileSync(DEBUG_LOG, line);
  } catch {
    // ignore debug failures
  }
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// Cursor's Windows hook runner sometimes decodes UTF-8 stdin as Windows-1252.
// Example: em-dash "—" (E2 80 94) arrives as "â€\u201d". Reverse that.
const WIN1252_REVERSE = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

function looksMojibake(s) {
  return /â€.|Ã.|Â./.test(s);
}

function repairMojibake(s) {
  if (typeof s !== "string" || !s || !looksMojibake(s)) return s;
  const bytes = [];
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code <= 0xff) {
      bytes.push(code);
    } else if (WIN1252_REVERSE[code] !== undefined) {
      bytes.push(WIN1252_REVERSE[code]);
    } else {
      return s;
    }
  }
  const repaired = Buffer.from(bytes).toString("utf8");
  if (repaired.includes("\uFFFD")) return s;
  return repaired;
}

function normalizeWinPath(p) {
  if (typeof p !== "string" || !p) return p;
  if (/^\/[A-Za-z]:\//.test(p)) {
    return p.slice(1).replace(/\//g, "\\");
  }
  return p;
}

function resolveProjectDir(payload) {
  const envDir =
    process.env.CURSOR_PROJECT_DIR || process.env.CLAUDE_PROJECT_DIR;
  if (envDir) return normalizeWinPath(envDir);
  const roots = payload && payload.workspace_roots;
  if (Array.isArray(roots) && roots[0]) return normalizeWinPath(roots[0]);
  return process.cwd();
}

function sessionIdOf(payload) {
  return (
    payload.conversation_id ||
    payload.session_id ||
    payload.generation_id ||
    "unknown-session"
  );
}

function sessionShort(sessionId) {
  return String(sessionId).slice(0, 8);
}

function modelOf(payload) {
  return payload.model || payload.model_id || "cursor-grok-4.6";
}

function isSubagentPayload(payload) {
  const t =
    payload.transcript_path ||
    process.env.CURSOR_TRANSCRIPT_PATH ||
    payload.agent_transcript_path ||
    "";
  return /subagents/i.test(String(t));
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").trim();
}

async function readPayload() {
  const fromStdin = await readStdin();
  if (fromStdin) {
    try {
      return JSON.parse(fromStdin);
    } catch (err) {
      debug("stdin JSON parse failed", { err: String(err), fromStdin });
    }
  }
  const argPath = process.argv[2];
  if (argPath && fs.existsSync(argPath)) {
    return JSON.parse(fs.readFileSync(argPath, "utf8"));
  }
  return {};
}

function logsDir(projectDir) {
  return path.join(projectDir, ".agent-logs");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function findSessionFile(dir, sessionId) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const suffix = `_${sessionId}.md`;
  const byName = files.find((f) => f.endsWith(suffix));
  if (byName) return path.join(dir, byName);
  for (const f of files) {
    const full = path.join(dir, f);
    const head = fs.readFileSync(full, "utf8").slice(0, 1200);
    if (head.includes(`session_id: ${sessionId}`)) return full;
  }
  return null;
}

function fileNameFor(sessionId, timestampIso) {
  const d = new Date(timestampIso);
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = [
    d.getUTCFullYear(),
    pad(d.getUTCMonth() + 1),
    pad(d.getUTCDate()),
  ].join("-") +
    "_" +
    [pad(d.getUTCHours()), pad(d.getUTCMinutes()), pad(d.getUTCSeconds())].join(
      "-"
    );
  return `${stamp}_${sessionId}.md`;
}

function createSessionFile(dir, sessionId, timestamp, model) {
  const date = timestamp.slice(0, 10);
  const short = sessionShort(sessionId);
  const file = path.join(dir, fileNameFor(sessionId, timestamp));
  const body = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `author: ${AUTHOR}`,
    `model: ${model}`,
    `tool: ${TOOL}`,
    `project: ${PROJECT}`,
    `total_exchanges: 0`,
    `first_prompt_time: ${timestamp}`,
    `last_prompt_time: ${timestamp}`,
    "---",
    "",
    `# Session Log - ${date}`,
    "",
    `Session: \`${short}\` | Project: \`${PROJECT}\` | Author: \`${AUTHOR}\``,
    "",
    "---",
    "",
    "",
  ].join("\n");
  fs.writeFileSync(file, body, "utf8");
  return file;
}

function ensureSessionFile(dir, sessionId, timestamp, model) {
  ensureDir(dir);
  return (
    findSessionFile(dir, sessionId) ||
    createSessionFile(dir, sessionId, timestamp, model)
  );
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { attrs: {}, rest: text, raw: "" };
  const raw = match[1];
  const attrs = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    attrs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { attrs, rest: text.slice(match[0].length), raw };
}

function writeFrontmatter(attrs) {
  const order = [
    "session_id",
    "date",
    "author",
    "model",
    "tool",
    "project",
    "total_exchanges",
    "first_prompt_time",
    "last_prompt_time",
  ];
  const seen = new Set();
  const lines = ["---"];
  for (const key of order) {
    if (attrs[key] !== undefined) {
      lines.push(`${key}: ${attrs[key]}`);
      seen.add(key);
    }
  }
  for (const [key, value] of Object.entries(attrs)) {
    if (!seen.has(key)) lines.push(`${key}: ${value}`);
  }
  lines.push("---");
  return lines.join("\n") + "\n";
}

function countEntries(text, type) {
  const re = new RegExp(
    `\\[LOG_ENTRY type=${type} num=(\\d+) session=`,
    "g"
  );
  let max = 0;
  let m;
  while ((m = re.exec(text))) {
    max = Math.max(max, Number(m[1]));
  }
  return max;
}

function formatEntry(type, num, sessionId, timestamp, model, body) {
  const content = String(body == null ? "" : body).replace(/\s+$/, "");
  return [
    `[LOG_ENTRY type=${type} num=${num} session=${sessionShort(sessionId)}]`,
    `timestamp: ${timestamp}`,
    `model: ${model}`,
    "",
    content,
    "",
    "",
  ].join("\n");
}

function replaceOrAppendEntry(fileText, type, num, sessionId, entry) {
  const short = sessionShort(sessionId);
  const re = new RegExp(
    `\\[LOG_ENTRY type=${type} num=${num} session=${short}\\][\\s\\S]*?(?=\\[LOG_ENTRY type=|$)`
  );
  if (re.test(fileText)) {
    return fileText.replace(re, entry);
  }
  return fileText.replace(/\s*$/, "\n\n") + entry;
}

function updateSessionFile(file, mutator) {
  const original = fs.readFileSync(file, "utf8");
  const parsed = parseFrontmatter(original);
  const next = mutator(parsed);
  const out =
    writeFrontmatter(next.attrs) +
    (next.rest.startsWith("\n") ? next.rest : "\n" + next.rest);
  fs.writeFileSync(file, out.replace(/\s*$/, "\n"), "utf8");
}

function extractTextParts(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part) => part && (part.type === "text" || part.text) && part.text)
    .map((part) => part.text)
    .join("\n\n");
}

function hasToolUse(content) {
  if (!Array.isArray(content)) return false;
  return content.some((part) => part && part.type === "tool_use");
}

function extractFinalResponseFromTranscript(transcriptPath) {
  if (!transcriptPath) return "";
  const resolved = normalizeWinPath(transcriptPath);
  if (!fs.existsSync(resolved)) return "";
  const lines = fs
    .readFileSync(resolved, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      events.push(JSON.parse(line));
    } catch {
      // skip malformed lines
    }
  }
  let lastUser = -1;
  for (let i = 0; i < events.length; i++) {
    if (events[i].role === "user") lastUser = i;
  }
  if (lastUser < 0) return "";
  const after = events.slice(lastUser + 1).filter((e) => e.role === "assistant");
  if (!after.length) return "";
  const textOnly = after.filter((e) => {
    const content = (e.message && e.message.content) || e.content || [];
    return !hasToolUse(content) && extractTextParts(content);
  });
  const pick = (textOnly.length ? textOnly : after).at(-1);
  const content = (pick.message && pick.message.content) || pick.content || [];
  return extractTextParts(content);
}

function writePrompt(projectDir, payload, timestamp) {
  const sessionId = sessionIdOf(payload);
  const model = modelOf(payload);
  const prompt = repairMojibake(payload.prompt);
  if (typeof prompt !== "string") {
    debug("beforeSubmitPrompt missing prompt field", {
      keys: Object.keys(payload || {}),
    });
    return;
  }
  const file = ensureSessionFile(
    logsDir(projectDir),
    sessionId,
    timestamp,
    model
  );
  updateSessionFile(file, ({ attrs, rest }) => {
    const num = countEntries(rest, "PROMPT") + 1;
    attrs.total_exchanges = String(num);
    attrs.last_prompt_time = timestamp;
    attrs.model = model;
    if (!attrs.first_prompt_time) attrs.first_prompt_time = timestamp;
    const entry = formatEntry("PROMPT", num, sessionId, timestamp, model, prompt);
    return { attrs, rest: rest.replace(/\s*$/, "\n\n") + entry };
  });
  debug("wrote PROMPT", { file, sessionId });
}

function writeResponse(projectDir, payload, timestamp, text) {
  const sessionId = sessionIdOf(payload);
  const model = modelOf(payload);
  const body = text == null ? "" : repairMojibake(String(text));
  if (!body.trim()) {
    debug("skip empty RESPONSE", { sessionId });
    return;
  }
  const dir = logsDir(projectDir);
  const existing = findSessionFile(dir, sessionId);
  if (!existing) {
    debug("skip RESPONSE with no session file yet", { sessionId });
    return;
  }
  updateSessionFile(existing, ({ attrs, rest }) => {
    const promptCount = countEntries(rest, "PROMPT");
    if (!promptCount) {
      debug("skip RESPONSE with no matching PROMPT", { sessionId });
      return { attrs, rest };
    }
    attrs.model = model;
    const entry = formatEntry(
      "RESPONSE",
      promptCount,
      sessionId,
      timestamp,
      model,
      body
    );
    return {
      attrs,
      rest: replaceOrAppendEntry(rest, "RESPONSE", promptCount, sessionId, entry),
    };
  });
  debug("wrote RESPONSE", { file: existing, sessionId });
}

async function main() {
  let payload = {};
  try {
    payload = await readPayload();
  } catch (err) {
    debug("failed to read payload", { err: String(err) });
    process.stdout.write("{}\n");
    return;
  }

  const event = payload.hook_event_name || "";
  debug("hook", {
    event,
    conversation_id: payload.conversation_id,
    session_id: payload.session_id,
    model: payload.model,
    model_id: payload.model_id,
    hasPrompt: typeof payload.prompt === "string",
    textLen: typeof payload.text === "string" ? payload.text.length : 0,
    promptMojibake:
      typeof payload.prompt === "string" && looksMojibake(payload.prompt),
    argv: process.argv,
    hookEnv: Object.keys(process.env)
      .filter((k) => /CURSOR|HOOK|CLAUDE/i.test(k))
      .sort(),
    transcript_path: payload.transcript_path || process.env.CURSOR_TRANSCRIPT_PATH,
  });

  if (isSubagentPayload(payload)) {
    debug("skip subagent event", { event });
    process.stdout.write("{}\n");
    return;
  }

  const projectDir = resolveProjectDir(payload);
  const timestamp = nowIso();

  try {
    if (event === "beforeSubmitPrompt") {
      writePrompt(projectDir, payload, timestamp);
      process.stdout.write('{"continue":true}\n');
      return;
    }

    if (event === "afterAgentResponse") {
      writeResponse(projectDir, payload, timestamp, payload.text);
      process.stdout.write("{}\n");
      return;
    }

    if (event === "stop") {
      const transcript =
        payload.transcript_path || process.env.CURSOR_TRANSCRIPT_PATH;
      const fromTranscript = extractFinalResponseFromTranscript(transcript);
      const text = payload.text || fromTranscript;
      writeResponse(projectDir, payload, timestamp, text);
      process.stdout.write("{}\n");
      return;
    }

    process.stdout.write("{}\n");
  } catch (err) {
    debug("handler failed", { event, err: String(err), stack: err.stack });
    process.stdout.write("{}\n");
  }
}

main();
