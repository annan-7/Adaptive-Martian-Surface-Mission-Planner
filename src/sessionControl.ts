export function facilitatorOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && url.origin === value ? value : null;
  } catch { return null; }
}

export function controlledTime(data: unknown, sessionId: string): number | null {
  const message = data as { type?: string; sessionId?: string; time?: number } | null;
  return message?.type === "mars-compass:set-time" && message.sessionId === sessionId
    && Number.isInteger(message.time) && message.time! >= 840 && message.time! <= 905
    ? message.time! : null;
}
