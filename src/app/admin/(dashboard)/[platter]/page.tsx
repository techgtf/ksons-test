"use client";

import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import {
  useRouter,
  useParams,
  notFound,
  useSearchParams,
} from "next/navigation";
import { HiOutlinePlus } from "react-icons/hi";

import {
  ADMIN_SECTION_REGISTRY,
  FilterConfig,
} from "@/src/admin/config/adminConfig";
import DataTable from "@/src/admin/components/shared/DataTable";
import { useCrud } from "@/src/admin/hooks/useCrud";
import SearchInput from "@/src/admin/components/shared/SearchInput";
import SelectRows from "@/src/admin/components/shared/SelectRows";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import { useDropdownOptions } from "@/src/admin/hooks/useDropdownOptions";
import { GetNestedValue } from "@/src/admin/components/cells/GetNestedValue";
import { TableButton } from "@/src/admin/components/cells/TableButton";

function FilterSelect({
  filterConfig,
  value,
  onChange,
}: {
  filterConfig: FilterConfig;
  value: string;
  onChange: (val: string, label: string) => void;
}) {
  const { options, isLoading } = useDropdownOptions(
    filterConfig.dynamicSource,
    undefined,
    filterConfig.valueField || "id",
  );

  const resolvedOptions = filterConfig.dynamicSource
    ? options
    : filterConfig.options || [];

  return (
    <SelectRows
      value={value}
      onChange={(val) => {
        const found = resolvedOptions.find((opt) => opt.value === val);
        onChange(val, found ? found.label : "");
      }}
      options={[
        { label: `All ${filterConfig.label}`, value: "" },
        ...resolvedOptions,
      ]}
      placeholder={isLoading ? "Loading..." : `All ${filterConfig.label}`}
    />
  );
}

export default function DynamicListPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = params.platter as string;

  const { options: platterOptions } = useDropdownOptions(
    slug === "project" ? "platter" : undefined,
  );

  if (!ADMIN_SECTION_REGISTRY[slug]) {
    return notFound();
  }

  const routeParams = useMemo(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    // Map category parameter to platterId for projects to align with Redux state keys
    if (slug === "project" && paramsObj.category && platterOptions.length > 0) {
      const found = platterOptions.find(
        (opt) => opt.label.toLowerCase() === paramsObj.category.toLowerCase(),
      );
      if (found) {
        paramsObj.platterId = found.value;
        delete paramsObj.category;
      }
    }
    return paramsObj;
  }, [searchParams, slug, platterOptions]);

  const {
    rows,
    updateSequence,
    isLoadingList,
    remove,
    fetchList,
    config,
    pagination,
    filter,
    setFilters,
    setSearch,
    setPage,
    setLimit,
  } = useCrud(slug, routeParams);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (slug === "project") {
      const currentPlatterId = filter.filters?.platterId;
      if (categoryParam) {
        if (platterOptions.length > 0) {
          const found = platterOptions.find(
            (opt) => opt.label.toLowerCase() === categoryParam.toLowerCase(),
          );
          const targetPlatterId = found ? found.value : "";
          if (currentPlatterId !== targetPlatterId) {
            setFilters({ platterId: targetPlatterId });
          }
        }
      } else {
        if (currentPlatterId !== undefined) {
          const newFilters = { ...filter.filters };
          delete newFilters.platterId;
          setFilters(newFilters);
        }
      }
    }
  }, [categoryParam, slug, platterOptions, filter.filters, setFilters]);

  useEffect(() => {
    if (slug === "project") return;

    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "limit" && key !== "search") {
        paramsObj[key] = value;
      }
    });

    const reduxFilters = filter.filters || {};
    const paramsKeys = Object.keys(paramsObj);
    const reduxKeys = Object.keys(reduxFilters);

    const isMatch =
      paramsKeys.length === reduxKeys.length &&
      paramsKeys.every((key) => reduxFilters[key] === paramsObj[key]);

    if (!isMatch) {
      setFilters(paramsObj);
    }
  }, [searchParams, slug, filter.filters, setFilters]);

  const columns = useMemo(
    () =>
      config.listColumns.map((col) => {
        if (col.dataKey === "projectStatus.name") {
          return {
            ...col,
            render: (row: Record<string, unknown>) => {
              const value = GetNestedValue(row, col.dataKey);
              return (
                <TableButton
                  label={String(value ?? "-")}
                  icon={col.showIcon}
                  bg="bg-blue-50"
                  textColor="text-green-700"
                />
              );
            },
          };
        }

        if (
          col.dataKey === "date" ||
          col.dataKey === "createdAt" ||
          col.dataKey.toLowerCase().includes("date")
        ) {
          return {
            ...col,
            render: (row: Record<string, unknown>) => {
              const value = GetNestedValue(row, col.dataKey);
              if (!value) return "-";
              const date = new Date(value as string);
              return (
                <span className="block text-sm font-medium text-gray-700">
                  {isNaN(date.getTime())
                    ? String(value)
                    : `${String(date.getDate()).padStart(2, "0")}/${String(
                        date.getMonth() + 1,
                      ).padStart(2, "0")}/${String(date.getFullYear())}`}
                </span>
              );
            },
          };
        }

        return col;
      }),
    [config],
  );

  const hideDeleteFor = ["project", "cities"];
  const canDelete = !hideDeleteFor.includes(slug);

  const hideHeader = slug !== "countries" && slug !== "states";

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {config.title}
          </h1>
        </div>

        {hideHeader && (
          <div className={`flex flex-wrap items-center gap-4 `}>
            {config.displaySearch && (
              <div className="w-full sm:w-[400px]">
                <SearchInput
                  onSearch={(term) => {
                    setSearch(term);
                    setPage(1);
                    setLimit(10);
                    setFilters({});
                  }}
                />
              </div>
            )}

            {config.filters?.map((f) => (
              <div className="w-full sm:w-[200px]" key={f.name + "filter"}>
                <FilterSelect
                  filterConfig={f}
                  value={(filter.filters?.[f.name] as string) || ""}
                  onChange={(val, label) => {
                    if (slug === "project" && f.name === "platterId") {
                      if (val) {
                        router.push(
                          `/admin/project?category=${label.toLowerCase()}`,
                        );
                      } else {
                        router.push("/admin/project");
                      }
                    } else {
                      const newFilters = { ...filter.filters };
                      if (val) {
                        newFilters[f.name] = val;
                      } else {
                        delete newFilters[f.name];
                      }
                      setFilters(newFilters);
                    }
                  }}
                />
              </div>
            ))}

            {slug !== "projectStatus" && (
              <Link
                href={`/admin/${slug}/add${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f3c78] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#0a2a54] active:scale-95"
              >
                <HiOutlinePlus className="text-lg" />
                Add {config.title}
              </Link>
            )}
          </div>
        )}
      </div>
      {/* <div className="flex items-center justify-center py-20">Loading...</div> */}
      {isLoadingList ? (
        <AdminLoader />
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          rowKey={(row) => String(row.id ?? Math.random())}
          pagination={pagination}
          onPageChange={setPage}
          pageSize={pagination.limit}
          emptyMessage={`No ${config.noun} found`}
          footerText={(count) => `Showing ${count} ${config.noun}`}
          onEdit={(row) => router.push(`/admin/${slug}/${row.id}`)}
          onDelete={canDelete ? (row) => remove(String(row.id)) : undefined}
          onLimitChange={setLimit}
          showActions={
            slug !== "projectStatus" &&
            slug !== "countries" &&
            slug !== "states" &&
            slug !== "enquies" &&
            slug !== "newsletter" &&
            slug !== "jobs"
          }
          endpoint={config.endpoint}
          onRefresh={fetchList}
          updateSequence={updateSequence}
          slug={slug}
        />
      )}
    </div>
  );
}
