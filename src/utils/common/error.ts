export enum CommonErrorCode {
  OK = 0,
  UNKNOWN = -1,
  ASSERT = -2,
}

const extensionStatusSymbol = Symbol('extensionStatus');

interface ExtensionStatusError {
  readonly msg: string;
  readonly code: number;
  readonly ok: false;
  readonly stack: string | undefined;
  readonly extra: Record<string, any> | undefined;
  readonly value: null;
  readonly [extensionStatusSymbol]: true;
}

interface ExtensionStatusSuccess<T> {
  readonly msg: '';
  readonly code: 0;
  readonly ok: true;
  readonly stack: null;
  readonly extra: null;
  readonly value: T;
  readonly [extensionStatusSymbol]: true;
}

export type ExtensionStatus<T> = ExtensionStatusError | ExtensionStatusSuccess<T>;

export function makeOk(): ExtensionStatusSuccess<void> {
  return {
    msg: '',
    code: 0,
    ok: true,
    stack: null,
    extra: null,
    value: undefined,
    [extensionStatusSymbol]: true,
  };
}

export function makeOkWith<T>(value: T): ExtensionStatusSuccess<T> {
  return {
    msg: '',
    code: 0,
    ok: true,
    stack: null,
    extra: null,
    value,
    [extensionStatusSymbol]: true,
  };
}

export function makeError(code: number, msg: string, extra?: Record<string, any>): ExtensionStatusError {
  if (code === CommonErrorCode.OK) {
    return makeError(CommonErrorCode.UNKNOWN, '[makeError] error code should not be ok');
  }

  return {
    msg,
    code,
    ok: false,
    stack: new Error().stack,
    extra,
    value: null,
    [extensionStatusSymbol]: true,
  };
}

export function makeErrorBy(code: number, ex: Error, extra: Record<string, any> = {}) {
  return {
    msg: ex.message,
    code,
    ok: false,
    stack: ex.stack,
    extra,
    value: null,
    [extensionStatusSymbol]: true,
  };
}

export function isExtensionError(err: unknown): err is ExtensionStatus<any> {
  return typeof err === 'object' && err !== null && (err as any)[extensionStatusSymbol] === true;
}
