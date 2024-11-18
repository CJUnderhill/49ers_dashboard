import { Column } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortHeaderProps<T> = {
  column: Column<T, unknown>;
  title: string;
};

export function SortHeader<T>({ column, title }: SortHeaderProps<T>) {

  const isSorted = column.getIsSorted();
  const isSortedAsc = isSorted === "asc";
  const isSortedDesc = isSorted === "desc";

  return (
    <div
      className="flex items-center justify-start text-sm font-semibold text-white cursor-pointer"
      onClick={column.getToggleSortingHandler()}
    >
      {isSorted ? (
        <div className="uppercase text-[11px] text-[#B3995D] pr-1">
          {title}
        </div>
      ) :
        <div className="uppercase text-[11px] pr-1">
          {title}
        </div>
      }

      {isSorted ? (
        isSortedAsc ? (
          <div className="flex h-full flex-col">
            <ChevronUp className="size-3 text-[#B3995D]" />
            <ChevronDown className="size-3 text-white" />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ChevronUp className="size-3 text-white" />
            <ChevronDown className="size-3 text-[#B3995D]" />
          </div>)
      ) :
        <div className="flex h-full flex-col">
          <ChevronUp className="size-3 text-white" />
          <ChevronDown className="size-3 text-white" />
        </div>
      }

    </div>
  );
}
