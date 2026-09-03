export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      const fallbackText = await res.text().catch(() => '');
      console.warn(`[safeFetchJson] Warning: ${input} returned non-JSON (${res.status}):`, fallbackText.slice(0, 100));
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[safeFetchJson] Network/Parse error fetching ${input}:`, err);
    return null;
  }
}
