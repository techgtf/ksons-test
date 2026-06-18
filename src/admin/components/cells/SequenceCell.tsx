import React, { useEffect, useRef, useState } from "react";

interface Props {
  rowId: string;
  value: number;
  updateSequence: (id: string, value: number, path?: string) => Promise<void>;
  path?: string;
}

export function SequenceCell({ rowId, value, updateSequence, path }: Props) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const save = async (nextValue: number) => {
    if (nextValue === value) return;

    try {
      await updateSequence(rowId, nextValue, path);
    } catch (error) {
      console.error(error);
    }
  };

  const scheduleSave = (nextValue: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(nextValue);
    }, 600);
  };

  return (
    <input
      type="number"
      value={localValue}
      min={1}
      className="h-10 w-20 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all focus:border-[#0f3c78]"
      onChange={(e) => {
        const next = Number(e.target.value);
        setLocalValue(next);
        scheduleSave(next);
      }}
      onBlur={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        save(localValue);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
}

// import React, { useRef } from "react";

// interface Props {
//   rowId: string;
//   value: number;
//   updateSequence: (id: string, value: number, path?: string) => Promise<void>;
//   path?: string;
// }

// export function SequenceCell({ rowId, value, updateSequence, path }: Props) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   return (
//     <input
//       ref={inputRef}
//       type="number"
//       key={`${rowId}-${value}`}
//       defaultValue={value || 0}
//       min={1}
//       className="h-10 w-20 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all focus:border-[#0f3c78]"
//       onBlur={async (e) => {
//         const next = Number(e.target.value);
//         if (next === value) return;
//         try {
//           await updateSequence(rowId, next, path);
//         } catch (error) {
//           console.error(error);
//         }
//       }}
//     />
//   );
// }
