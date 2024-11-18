import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";
import Player from "../../types/player";

interface PlayerDetailsPanelProps {
  player: Player;
  onClose: () => void;
  selectedWeek: number | null;
}

const PlayerDetailsPanel: React.FC<PlayerDetailsPanelProps> = ({ player, onClose, selectedWeek }) => {
  const chartData = Object.entries(player.rankings_dict).map(([week, rank]) => ({
    "week": week,
    "rank": 17 - rank,
  }));

  // Utility function for custom bar color
  const renderBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const isHighlighted = parseInt(payload.week) === selectedWeek;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isHighlighted ? "white" : "#B3995D"}
      />
    );
  };

  return (
    <div className="fixed bottom-0 right-0 mx-8 w-[420px] h-1/2 bg-white shadow-xl p-4 z-50 overflow-y-auto rounded-t-[20px] outline outline-1 outline-neutral-100 scrollbar-hide">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white hover:text-[#B3995D] z-[100]"
      >
        <X className="size-5" />
      </button>

      {/* Rankings Chart */}
      <ResponsiveContainer width="100%" height={240} className="rounded-[10px] bg-[#AA0000]">
        <BarChart
          data={chartData}
          margin={{ top: 10, bottom: 10, left: 20, right: 20 }}
          className="rounded-[10px] bg-gradient-to-r from-transparent to-black/40"
        >
          <text x={20} y={30} fill="white" fontSize={14} className="uppercase font-light">
            2023-2024
          </text>
          <text x={20} y={45} fill="white" fontSize={14} className="uppercase font-light">
            SEASON
          </text>

          <text x={205} y={38} fill="white" fontSize={24} className="uppercase font-light">
            Ranking:
            <tspan className="font-bold">{selectedWeek
              ? ` ${player.rankings_dict[selectedWeek]}`
              : ` ${player.season_rank}`}
            </tspan>
          </text>

          <XAxis
            dataKey="week"
            angle={-90}
            textAnchor="end"
            tick={{ fill: "white", fontSize: 8 }}
            tickLine={false}
            tickFormatter={(week) => (parseInt(week) === selectedWeek ? `WK: ${week}` : "")}
          />
          <YAxis hide domain={[0, 22]} />
          <Bar dataKey="rank" barSize={12} shape={renderBar} />
        </BarChart>
      </ResponsiveContainer>

      {/* Player Info */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src="/images/players/Photo.png"
            alt="Player"
            className="size-[80px] rounded-[10px] bg-gradient-to-b from-red-600 to-red-950"
          />
          <div>
            <h2 className="text-[24px] leading-tight">{player.first_name}</h2>
            <h2 className="text-[24px] leading-tight">{player.last_name}</h2>
            <p className="text-[15px] font-bold uppercase">{`#${player.number} | ${player.position}`}</p>
          </div>
        </div>
        <p className="mt-4 text-[15px]">{player.description}</p>
      </div>
    </div>
  );
};

export default PlayerDetailsPanel;
