import { jwtDecode } from 'jwt-decode';
import { JwtPayload, TokenResult } from './interface';
import { CLOCK_SKEW_MS, REFRESH_BUFFER_MS } from './contants';

export const verifyToken = (token: string | null | undefined): TokenResult => {
  const fail = (error: string, extras?: Partial<TokenResult>): TokenResult => ({
    valid: false,
    expired: false,
    payload: null,
    expiresInMs: 0,
    error,
    ...extras,
  });

  if (!token || typeof token !== 'string' || !token.trim()) {
    return fail('Token is missing or empty');
  }

  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(p => !p.trim())) {
    return fail('Invalid JWT structure (expected 3 segments).');
  }

  let payload: JwtPayload;
  try {
    payload = jwtDecode<JwtPayload>(token);
  } catch {
    return fail('Token could not be decoded.');
  }

  if (typeof payload.exp !== 'number' || isNaN(payload.exp)) {
    return fail("Missing or invalid 'exp' claim.", { payload });
  }

  if (typeof payload.sub !== 'string' || !payload.sub.trim()) {
    return fail("Missing or invalid 'sub' claim.", { payload });
  }

  const nowMs = Date.now();
  const expiresInMs = payload.exp * 1000 - nowMs;

  if (expiresInMs + CLOCK_SKEW_MS <= 0) {
    return {
      valid: false,
      expired: true,
      payload,
      expiresInMs,
      error: 'Token has expired.',
    };
  }

  if (typeof payload.iat === 'number' && !isNaN(payload.iat)) {
    if (payload.iat * 1000 > nowMs + CLOCK_SKEW_MS) {
      return fail('Token issued in the future — check device clock.', {
        payload,
      });
    }
  }

  return { valid: true, expired: false, payload, expiresInMs };
};

export const needsRefresh = (token: string | null | undefined): boolean => {
  const { valid, expiresInMs } = verifyToken(token);
  return !valid || expiresInMs <= REFRESH_BUFFER_MS;
};
