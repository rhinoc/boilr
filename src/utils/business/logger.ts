import * as vscode from 'vscode';
import { EXTENSION_NAMES } from '$constants/name';
import { getConfigurationByKey } from './configuration';
import { isExtensionError } from '../common/error';

export enum LogLevel {
  INFO,
  WARN,
  ERROR,
}

function mapString2LogLevel(str: string) {
  switch (str) {
    case 'info':
      return LogLevel.INFO;
    case 'warn':
      return LogLevel.WARN;
    case 'error':
      return LogLevel.ERROR;
    default:
      return LogLevel.WARN;
  }
}

class Logger {
  private _channel: vscode.OutputChannel;

  private _logLevel: LogLevel;
  constructor() {
    this._channel = vscode.window.createOutputChannel(EXTENSION_NAMES.original);

    this._logLevel = mapString2LogLevel(getConfigurationByKey('logLevel'));
  }

  setLogLevel(level: LogLevel) {
    this._logLevel = level;
  }

  _stringify(arg: unknown): string {
    if (isExtensionError(arg)) {
      return `${arg.code}: ${arg.msg} ${arg.extra ? this._stringify(arg.extra) : ''}\n${arg.stack}`;
    }

    if (arg instanceof Error) {
      return `${arg.name}: ${arg.message}\n${arg.stack}`;
    }

    if (arg === undefined || arg === null) {
      return 'nil';
    }

    if (['number', 'string', 'boolean'].includes(typeof arg)) {
      return String(arg);
    }

    if (typeof arg === 'object') {
      if (Object.keys(arg).length || Array.isArray(arg)) {
        return JSON.stringify(arg, null, 2);
      } else {
        return 'empty object';
      }
    }

    return `unknown ${typeof arg}`;
  }

  _append(...args: any[]) {
    const message = args.map((arg) => this._stringify(arg)).join(' ');
    this._channel.appendLine(message);
  }

  append(level: LogLevel, ...args: any[]) {
    if (level >= this._logLevel) {
      this._append(...args);
    }
  }

  info(...args: any[]) {
    this.append(LogLevel.INFO, ...args);
  }

  warn(...args: any[]) {
    this.append(LogLevel.WARN, ...args);
  }

  error(...args: any[]) {
    this.append(LogLevel.ERROR, ...args);
  }

  toast(type: 'info' | 'error', message: string) {
    vscode.window[type === 'error' ? 'showErrorMessage' : 'showInformationMessage'](
      `[${EXTENSION_NAMES.original}] ${message}`,
    );
  }

  clear() {
    this._channel.clear();
  }
}

export const logger = new Logger();
