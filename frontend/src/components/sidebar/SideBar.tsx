import React, { useState } from "react";
import { Tooltip } from "../ui/Tooltip";

type SidebarProps = {
  applyRangeFilter: (filterType: string, range: { from: number; to: number }) => void;
  setPlayerNumberFilter: (value: string) => void;
  setPositionFilter: (value: string) => void;
  clearFilters: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  applyRangeFilter,
  setPlayerNumberFilter,
  setPositionFilter,
  clearFilters,
}) => {
  const [filterType, setFilterType] = useState<"seasonRank" | "experience">("seasonRank");
  const [range, setRange] = useState({ from: "", to: "" });

  const handleApplyRangeFilter = () => {
    if (range.from && range.to) {
      applyRangeFilter(filterType, { from: Number(range.from), to: Number(range.to) });
    }
  };

  return (
    <div className="flex flex-col w-[300px] bg-gradient-to-r from-transparent to-black/40 bg-no-repeat text-[14px]">
      <div className="h-[48px] border-b-2 border-white border-opacity-20"></div>
      <div className="p-8 space-y-8">

        {/* Filter Options */}
        <div className="space-y-2 text-white">
          <h3 className="uppercase font-extrabold text-[12px]">Filter Options</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="filterType"
                value="seasonRank"
                checked={filterType === "seasonRank"}
                onChange={() => setFilterType("seasonRank")}
              />
              <span className="ml-2">Season Rank</span>
              <Tooltip text="Filters by player's season ranking." />
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filterType"
                value="experience"
                checked={filterType === "experience"}
                onChange={() => setFilterType("experience")}
              />
              <span className="ml-2">Experience</span>
              <Tooltip text="Filters by player's years of experience." />
            </label>
          </div>
        </div>

        {/* Filter Range */}
        <div className="space-y-2">
          <h3 className="uppercase font-extrabold text-[12px] text-white">Filter Range:</h3>
          <div className="flex flex-row justify-start space-x-4">
            <input
              type="text"
              placeholder="From"
              value={range.from}
              onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
              className="rounded-[5px] w-[100px] h-[36px] px-4 font-light"
            />
            <input
              type="text"
              placeholder="To"
              value={range.to}
              onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
              className="rounded-[5px] w-[100px] h-[36px] px-4 font-light"
            />
          </div>
          <div className="flex flex-row justify-start space-x-4">
            <button
              onClick={handleApplyRangeFilter}
              className="bg-[#B3995D] text-white text-[12px] uppercase rounded-[25px] w-[80px] h-[30px] px-4 font-light"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setRange({ from: "", to: "" });
                clearFilters();
              }}
              className="bg-black bg-opacity-50 text-white text-[12px] uppercase rounded-[25px] w-[80px] h-[30px] px-4 font-light"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Player Number */}
        <div className="space-y-2">
          <h3 className="uppercase font-extrabold text-[12px] text-white">Player Number:</h3>
          <input
            type="text"
            placeholder="Enter Player Number"
            onChange={(e) => setPlayerNumberFilter(e.target.value)}
            className="rounded-[5px] h-[36px] px-4 font-light"
          />
        </div>

        {/* Position */}
        <div className="space-y-2">
          <h3 className="uppercase font-extrabold text-[12px] text-white">Position:</h3>
          <input
            type="text"
            placeholder="Enter Position"
            onChange={(e) => setPositionFilter(e.target.value)}
            className="rounded-[5px] h-[36px] px-4 font-light"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
