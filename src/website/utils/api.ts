import { BASE_WEBSITE } from "@/config";

export async function fetchPageData(endpoint: string, revalidateSeconds = 0) {
  try {
    const res = await fetch(`${BASE_WEBSITE}${endpoint}`, {
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
      console.error("API Error:", res.status, endpoint);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Fetch failed:", endpoint, error);
    return null;
  }
}
