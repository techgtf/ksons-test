"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlinePlus } from "react-icons/hi";

import DataTable from "@/src/admin/components/shared/DataTable";
import { useCrud } from "@/src/admin/hooks/useCrud";
import SearchInput from "@/src/admin/components/shared/SearchInput";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import { GetNestedValue } from "@/src/admin/components/cells/GetNestedValue";

export default function PagesListPage() {
  const router = useRouter();
  const slug = "pages";

  const {
    rows,
    isLoadingList,
    remove,
    config,
    pagination,
    fetchList,
    setSearch,
    setPage,
    setLimit,
  } = useCrud(slug);

  const hideDeleteFor = ["pages"];
  const canDelete = !hideDeleteFor.includes(slug);

  const columns = React.useMemo(() => {
    return config.listColumns.map((col) => {
      if (col.isAction && col.linkTemplate) {
        return {
          ...col,
          linkTemplate: col.linkTemplate.replace("{slug}", slug),
        };
      }
      return col;
    });
  }, [config.listColumns, slug]);

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {config.noun}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {config.displaySearch && (
            <div className="w-full sm:w-[400px]">
              <SearchInput
                onSearch={(term) => {
                  setSearch(term);
                  setPage(1);
                  setLimit(10);
                }}
              />
            </div>
          )}

          <Link
            href={`/admin/${slug}/add`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f3c78] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#0a2a54] active:scale-95"
          >
            <HiOutlinePlus className="text-lg" />
            Add Page
          </Link>
        </div>
      </div>

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
          showActions={true}
          endpoint={config.endpoint}
          onRefresh={fetchList}
          slug={slug}
        />
      )}
    </div>
  );
}
