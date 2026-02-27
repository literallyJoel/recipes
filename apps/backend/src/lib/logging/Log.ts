import chalk from "chalk";
import { inspect } from "node:util";

type Meta = Record<string, unknown>;
type LogLevel = "info" | "warn" | "error" | "debug";

const CONSOLE_ENABLED = process.env.LOG_CONSOLE !== "false";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel | undefined) ?? "debug";

const LEVEL_STYLES: Record<
  LogLevel,
  {
    label: string;
    badge: (s: string) => string;
    messageFn: (s: string) => string;
  }
> = {
  debug: {
    label: "DEBUG",
    badge: (s) => chalk.bgMagenta.white.bold(s),
    messageFn: (s) => chalk.gray(s),
  },
  info: {
    label: "INFO ",
    badge: (s) => chalk.bgCyan.black.bold(s),
    messageFn: (s) => chalk.white(s),
  },
  warn: {
    label: "WARN ",
    badge: (s) => chalk.bgYellow.black.bold(s),
    messageFn: (s) => chalk.yellow(s),
  },
  error: {
    label: "ERROR",
    badge: (s) => chalk.bgRed.white.bold(s),
    messageFn: (s) => chalk.red(s),
  },
};

function getCallerFile(): string | undefined {
  const err = new Error();
  const lines = err.stack?.split("\n");
  // [0] Error, [1] getCallerFile, [2] Log.info/etc, [3] actual caller
  const callerLine = lines?.[3];
  if (!callerLine) return undefined;

  const match =
    callerLine.match(/\((.+):(\d+):(\d+)\)$/) ??
    callerLine.match(/at (.+):(\d+):(\d+)$/);
  if (!match) return undefined;

  const rawPath = match[1].replace(/^file:\/\//, "");
  const normalizedCwd = process.cwd().replace(/\\/g, "/");
  const normalizedPath = rawPath.replace(/\\/g, "/");
  const filePath = normalizedPath.startsWith(`${normalizedCwd}/`)
    ? normalizedPath.slice(normalizedCwd.length + 1)
    : normalizedPath;
  return `${filePath}:${match[2]}`;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  file?: string;
  meta?: Meta;
  timestamp: string;
}

function log(entry: LogEntry): void {
  const { level } = entry;

  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  if (CONSOLE_ENABLED) {
    consoleLog(entry);
  }
}

function consoleLog({ level, message, file, meta, timestamp }: LogEntry): void {
  const style = LEVEL_STYLES[level];
  const ts = chalk.dim(formatTimestamp(timestamp));
  const label = style.badge(` ${style.label} `);
  const loc = file ? chalk.dim.italic(`(${file})`) : "";
  const msg = style.messageFn(message);

  const line = [label, ts, msg, loc].filter(Boolean).join(" ");

  if (meta) {
    const metaStr = formatMeta(meta);
    const output = `${line}\n${metaStr}`;

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  } else {
    switch (level) {
      case "error":
        console.error(line);
        break;
      case "warn":
        console.warn(line);
        break;
      default:
        console.log(line);
    }
  }
}

function formatTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  return date.toISOString().slice(11, 23);
}

function formatMeta(meta: Meta): string {
  const formatted = inspect(meta, {
    colors: true,
    depth: 6,
    compact: false,
    sorted: true,
  });

  return formatted
    .split("\n")
    .map((line) => `  ${chalk.dim("meta")} ${line}`)
    .join("\n");
}

export const Log = {
  debug(message: string, meta?: Meta): void {
    log({
      level: "debug",
      message,
      meta,
      file: getCallerFile(),
      timestamp: new Date().toISOString(),
    });
  },
  info(message: string, meta?: Meta): void {
    log({
      level: "info",
      message,
      meta,
      file: getCallerFile(),
      timestamp: new Date().toISOString(),
    });
  },
  warn(message: string, meta?: Meta): void {
    log({
      level: "warn",
      message,
      meta,
      file: getCallerFile(),
      timestamp: new Date().toISOString(),
    });
  },
  error(message: string, meta?: Meta): void {
    log({
      level: "error",
      message,
      meta,
      file: getCallerFile(),
      timestamp: new Date().toISOString(),
    });
  },
};
