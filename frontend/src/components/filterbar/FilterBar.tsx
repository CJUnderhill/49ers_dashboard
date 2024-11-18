// components/FilterBar.tsx
import React from 'react';

type FilterBarProps = {
  toggleSidebar: () => void;
  isSidebarVisible: boolean;
  setGlobalFilter: (value: string) => void;
  globalFilter: string;
  onDownloadCSV: () => void;
};

const FilterBar: React.FC<FilterBarProps> = ({ toggleSidebar, isSidebarVisible, setGlobalFilter, globalFilter, onDownloadCSV, }: FilterBarProps) => {
  return (
    <div className="bg-white h-[60px] px-8 flex items-center space-x-4">

      <button onClick={toggleSidebar} className={`bg-white text-[#B3995D] w-[90px] text-[12px] uppercase px-3 py-1 flex flex-row border-2 border-[#AA0000] rounded-md ${isSidebarVisible
        ? ""
        : "border-transparent"
        }`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        Filter
      </button>

      <input
        type="text"
        placeholder="SEARCH"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="border border[#DDDDDD] rounded-[5px] h-[36px] w-[280px] px-4 font-light"
      />

      <button onClick={onDownloadCSV} className="text-[#AA0000] font-semibold uppercase text-[14px]">Export Data</button>
    </div>
  );
};

export default FilterBar;
