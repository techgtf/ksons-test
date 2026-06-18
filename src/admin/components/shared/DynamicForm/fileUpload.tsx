import Image from "next/image";
import { useMemo } from "react";
import { HiOutlinePhotograph, HiOutlineVideoCamera } from "react-icons/hi";

function FileUpload({
  label,
  name,
  value,
  file,
  type,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  file?: File | null;
  type: "image" | "video";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const preview = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }

    return value || "";
  }, [file, value]);

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
        {label}
      </label>

      <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-blue-400 hover:bg-blue-50/30">
        <input
          type="file"
          name={name}
          accept={
            type === "image"
              ? "image/png, image/jpeg, image/jpg, image/webp"
              : "video/*"
          }
          className="hidden"
          onChange={onChange}
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
          {type === "image" ? (
            <HiOutlinePhotograph className="text-xl text-blue-600" />
          ) : (
            <HiOutlineVideoCamera className="text-xl text-purple-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-700">Upload {type}</p>

          <p className="truncate text-xs text-gray-400">
            {file?.name || "Click to browse"}
          </p>
        </div>
      </label>

      {preview && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2">
          {type === "image" ? (
            <div className="relative h-28 w-full overflow-hidden rounded-lg">
              <Image
                src={preview}
                alt={label}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <video
              src={preview}
              controls
              className="h-32 w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
