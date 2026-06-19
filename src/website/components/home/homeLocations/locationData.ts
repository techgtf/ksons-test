export const LocationCoords: Record<string, { lat: number; lng: number }> = {
  govardhan: { lat: 27.4963, lng: 77.4586 },
  vrindavan: { lat: 27.5650, lng: 77.6978 },
  mathura: { lat: 27.4924, lng: 77.6737 },
  noida: { lat: 28.5744, lng: 77.3519 },
  faridabad: { lat: 28.4089, lng: 77.3178 },
  hathras: { lat: 27.6007, lng: 78.0494 },
};

export function getLocationCoords(name: string): { lat: number; lng: number } {
  const norm = name.trim().toLowerCase();
  for (const key of Object.keys(LocationCoords)) {
    if (norm.includes(key) || key.includes(norm)) {
      return LocationCoords[key];
    }
  }
  // Default to Mathura center
  return { lat: 27.4924, lng: 77.6737 };
}

