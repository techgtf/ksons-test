import { useState, useEffect } from "react";
import api from "@/src/admin/lib/axios";
import { getSectionConfig } from "@/src/admin/config/adminConfig";

export interface FieldOption {
  label: string;
  value: string;
}

/**
 * A custom hook to fetch and format dropdown options from any admin section.
 * @param sectionKey - The key of the section in ADMIN_SECTION_REGISTRY (e.g., "platter", "typology")
 * @param labelField - The field to use as the label (defaults to "name" or "title")
 * @param valueField - The field to use as the value (defaults to "_id" or "id")
 */
export function useDropdownOptions(
  sectionKey: string | undefined,
  labelField?: string,
  valueField: string = "id", // Changed default to id as per project standard
  customEndpoint?: string,
) {
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionKey && !customEndpoint) return;

    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiPath = "";
        if (customEndpoint) {
          apiPath = customEndpoint;
        } else if (sectionKey) {
          const config = getSectionConfig(sectionKey);
          apiPath = config.endpoint;
        }

        if (!apiPath) return;

        // We fetch with a large limit to get all options for the dropdown
        const response = await api.get(apiPath, {
          params: { limit: 100 },
        });

        const data = response.data?.data || response.data || [];
        const rows = Array.isArray(data) ? data : data.rows || [];

        // Determine label field if not provided
        // We check common fields like name, title, label
        const firstRow = rows[0];
        const labelKeys = ["pageName", "name", "title", "label"];
        const inferredLabelField =
          labelField ||
          (firstRow
            ? labelKeys.find(
                (key) => key in firstRow && typeof firstRow[key] === "string",
              ) || "name"
            : "name");

        const formattedOptions = rows.map((row: any) => {
          const rawVal = row[valueField] || row.id || row._id;
          const val =
            typeof rawVal === "string" &&
            valueField !== "id" &&
            valueField !== "_id"
              ? rawVal.toLowerCase()
              : rawVal;
          return {
            label: String(
              row[inferredLabelField] || row.name || row.title || "Unknown",
            ),
            value: val,
          };
        });

        setOptions(formattedOptions);
      } catch (err: any) {
        console.error(`Error fetching options for ${sectionKey}:`, err);
        setError(err.message || "Failed to fetch options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [sectionKey, labelField, valueField, customEndpoint]);

  return { options, isLoading, error };
}
