import React from "react";
import { ListColumn } from "@/src/admin/config/adminConfig";
import { GetNestedValue } from "./GetNestedValue";
import { TableButton } from "./TableButton";
import { HiPlay } from "react-icons/hi";

interface Props {
  column: ListColumn;
  row: Record<string, unknown>;
}

export function CellValue({ column, row }: Props) {
  let raw = GetNestedValue(row, column.dataKey);

  // Fallback to nested files object
  if (raw === undefined || raw === null) {
    raw = (row.files as any)?.[column.dataKey];
  }

  // Detection Logic
  const isImageUrl = (url: string) =>
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const hasImageContent =
    (typeof raw === "string" && isImageUrl(raw)) ||
    (raw instanceof File && raw.type.startsWith("image/")) ||
    (typeof raw === "object" &&
      raw !== null &&
      "path" in raw &&
      isImageUrl((raw as any).path));

  const hasVideoContent =
    (typeof raw === "string" && isVideoUrl(raw)) ||
    (raw instanceof File && raw.type.startsWith("video/")) ||
    (typeof raw === "object" &&
      raw !== null &&
      "path" in raw &&
      isVideoUrl((raw as any).path));

  const isVideo =
    hasVideoContent || (!hasImageContent && column.type === "video");
  const isImage =
    hasImageContent || (!hasVideoContent && column.type === "image");

  if (isImage && raw) {
    const src =
      typeof raw === "string"
        ? raw
        : (raw as any).path || URL.createObjectURL(raw as any);
    return (
      <div className="relative group/thumb h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50 shadow-sm transition-all hover:scale-110 hover:shadow-md hover:z-10 cursor-zoom-in">
        <img
          src={src}
          alt={column.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/5 transition-colors" />
      </div>
    );
  }

  if (isVideo && raw) {
    const src =
      typeof raw === "string"
        ? raw
        : (raw as any).path || URL.createObjectURL(raw as any);
    return (
      <div className="relative group/video h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-950 shadow-sm transition-all hover:scale-110 hover:shadow-md hover:z-10">
        <video
          src={src}
          className="h-full w-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
          muted
          loop
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/0 transition-all">
          <HiPlay className="text-white w-5 h-5 drop-shadow-md group-hover/video:scale-0 transition-transform" />
        </div>
      </div>
    );
  }

  // Handle Date rendering
  if (column.type === "date" || column.dataKey.toLowerCase().includes("date")) {
    if (!raw) return <span>—</span>;
    const date = new Date(raw as string);
    return (
      <span className="block text-sm font-medium text-gray-700">
        {isNaN(date.getTime())
          ? String(raw)
          : `${String(date.getDate()).padStart(2, "0")}/${String(
              date.getMonth() + 1,
            ).padStart(2, "0")}/${String(date.getFullYear())}`}
      </span>
    );
  }

  const text = raw !== undefined && raw !== null ? String(raw) : "—";

  // Handle Highlight/Type rendering using TableButton
  if (
    column.type === "highlight" ||
    column.key === "type" ||
    column.dataKey === "type"
  ) {
    if (!raw) return <span>—</span>;
    return (
      <TableButton
        label={text}
        icon={false}
        bg="bg-indigo-50"
        textColor="text-indigo-700"
      />
    );
  }

  if (column.badge) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          background: String(raw ?? "#6b7280") + "22",
          color: String(raw ?? "#6b7280"),
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={
        column.truncate
          ? "block max-w-[220px] truncate text-gray-600"
          : "text-gray-700"
      }
      title={column.truncate ? text : undefined}
    >
      {text}
    </span>
  );
}
