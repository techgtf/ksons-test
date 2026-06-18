export function flattenObject(
  obj: Record<string, any>,
  parentKey = "",
  result: Record<string, any> = {},
) {
  Object.entries(obj || {}).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // skip File objects
    if (value instanceof File) {
      result[newKey] = value;
      return;
    }

    // recurse nested objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

export function buildFormData(form: Record<string, any>) {
  const formData = new FormData();

  function appendRecursive(key: string, value: any) {
    if (value === undefined || value === null) return;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, index) => {
        appendRecursive(`${key}[${index}]`, v);
      });
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendRecursive(`${key}[${subKey}]`, subValue);
      });
    } else {
      formData.append(key, String(value));
    }
  }

  Object.entries(form).forEach(([key, value]) => {
    // Convert dot notation (e.g., title.main) to bracket notation (e.g., title[main])
    const formattedKey = key.replace(/\.(\w+)/g, "[$1]");
    appendRecursive(formattedKey, value);
  });

  return formData;
}
