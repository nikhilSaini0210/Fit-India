export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

export interface TokenResult {
  valid: boolean;
  expired: boolean;
  payload: JwtPayload | null;
  expiresInMs: number;
  error?: string;
}
