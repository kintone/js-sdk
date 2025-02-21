export const buildTimeout = (timeout: number): { signal: AbortSignal } => {
  return { signal: AbortSignal.timeout(timeout) };
};
