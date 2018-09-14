export function isUrlString(str: string): boolean {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i.test(
    str
  );
}

export async function wait(ms: number): Promise<void> {
  await new Promise(r => setTimeout(r, ms));
  return;
}
