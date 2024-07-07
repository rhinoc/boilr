import { CommonErrorCode, makeError } from './error';

export function assert(expr: unknown, msg: string, extra: Record<string, any> = {}): asserts expr {
  if (!expr) {
    throw makeError(CommonErrorCode.ASSERT, msg, extra);
  }
}
