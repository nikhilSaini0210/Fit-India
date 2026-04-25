type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogOptions {
  tag?: string;
  data?: any;
}

const isDev = __DEV__;

const LOG_META: Record<
  LogLevel,
  { emoji: string; color: string; dim: string; label: string }
> = {
  INFO: { emoji: '💬', color: '\x1b[96m', dim: '\x1b[36m', label: 'INFO ' },
  WARN: { emoji: '⚠️ ', color: '\x1b[93m', dim: '\x1b[33m', label: 'WARN ' },
  ERROR: { emoji: '🔴', color: '\x1b[91m', dim: '\x1b[31m', label: 'ERROR' },
  DEBUG: { emoji: '🐛', color: '\x1b[95m', dim: '\x1b[35m', label: 'DEBUG' },
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const getTime = (): string =>
  new Date().toLocaleString('en-IN', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const serializeData = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

const buildMessage = (
  level: LogLevel,
  message: string,
  options?: LogOptions,
): string => {
  const { emoji, color, dim, label } = LOG_META[level];
  const time = getTime();
  const tag = options?.tag ? ` [${options.tag}]` : '';
  const data =
    options?.data !== undefined
      ? `\n   ${color}↳  ${serializeData(options.data)}${RESET}`
      : '';

  if (!isDev) {
    return `${emoji}  │ ${time} │ ${label}${tag}  ${message}${data}`;
  }

  return (
    `${emoji}  ` +
    `${dim}│${RESET} ` +
    `${color}${dim}${time}${RESET} ` +
    `${dim}│${RESET} ` +
    `${color}${BOLD}${label}${RESET}` +
    `${color}${tag}${RESET}` +
    `  ` +
    `${color}${message}${RESET}` +
    data
  );
};

const log = (level: LogLevel, message: string, options?: LogOptions): void => {
  if (!isDev && level === 'DEBUG') return;

  const output = buildMessage(level, message, options);

  switch (level) {
    case 'INFO':
      console.info(output);
      break;
    case 'WARN':
      console.warn(output);
      break;
    case 'ERROR':
      console.error(output);
      break;
    case 'DEBUG':
      console.log(output);
      break;
  }
};

export const logger = {
  info: (msg: string, options?: LogOptions) => log('INFO', msg, options),
  warn: (msg: string, options?: LogOptions) => log('WARN', msg, options),
  error: (msg: string, options?: LogOptions) => log('ERROR', msg, options),
  debug: (msg: string, options?: LogOptions) => log('DEBUG', msg, options),
};
