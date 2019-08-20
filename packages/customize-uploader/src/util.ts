export function isUrlString(str: string): boolean {
  return /^https?:\/\/.*/i.test(str);
}

export async function wait(ms: number): Promise<void> {
  await new Promise(r => setTimeout(r, ms));
  return;
}
