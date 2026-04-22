import { AppError, AppErrorCode } from '../types';

export function createAppError(
  code: AppErrorCode,
  message: string,
  errors?: { field: string; message: string }[],
): AppError {
  return { code, message, errors, isAppError: true };
}

export function isAppError(e: unknown): e is AppError {
  return (
    typeof e === 'object' && e !== null && (e as AppError).isAppError === true
  );
}
