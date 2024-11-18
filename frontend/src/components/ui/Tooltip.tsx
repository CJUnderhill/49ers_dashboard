import React from "react";

type TooltipProps = {
  text: string;
};

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <span className="relative group ml-2 cursor-pointer">
      <span className="text-[#B3995D]">?</span>
      <div className="absolute left-0 hidden w-[150px] p-2 text-white bg-black rounded-lg shadow-lg group-hover:block">
        {text}
      </div>
    </span>
  );
};
