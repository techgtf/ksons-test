export const getDisplayLabel = (value?: string): string => {
  if (!value) return "";

  // It is a text label. If it got prepended with the upload domain by the backend, strip it.
  const cleanValue = value
    .replace(/^https?:\/\/[^\/]+\/uploads\//i, "") // strips http(s)://domain/uploads/
    .replace(/^\/?uploads\//i, ""); // strips uploads/ or /uploads/

  try {
    return decodeURIComponent(cleanValue);
  } catch {
    return cleanValue;
  }
};
