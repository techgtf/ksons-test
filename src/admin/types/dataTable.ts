import React from "react";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  width?: string;
  className?: string;

  render?: (row: T, index: number) => React.ReactNode;
};

export interface DataTableProps<T> {
  data: T[];

  columns: Column<T>[];

  pageSize?: number;

  emptyMessage?: string;

  footerText?: (count: number) => string;

  rowKey: (row: T) => string;

  animated?: boolean;
}
