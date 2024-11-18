"use client";
import React, { useEffect, useState } from "react";
import Player from "../../types/player";
import FilterBar from "../filterbar/FilterBar";
import Sidebar from "../sidebar/SideBar";
import { DataTable } from "../datatable/data-table";
import { columns } from "../datatable/columns";
import PlayerDetailsPanel from "../playerdetailspanel/PlayerDetailsPanel";
import { saveAsCSV } from "../../lib/csv-utils";
import { SortHeader } from "../datatable/SortHeader";
import { ColumnDef } from "@tanstack/react-table";

interface PlayerInfoProps {
  selectedWeek: number | null;
  jwtToken: string | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ selectedWeek, jwtToken }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [players, setPlayers] = useState<Player[]>([]); // State to store player data
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]); // State for filtered players
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // Selected player state

  // Sidebar filter state
  const [filters, setFilters] = useState({
    playerNumber: "",
    position: "",
    rangeFilter: { type: "", range: { from: 0, to: 0 } },
  });

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const downloadCSV = () => {
    saveAsCSV(filteredPlayers, "player_data.csv");
  };

  const dynamicColumns = React.useMemo(() => {
    const dynamicCols = [...columns];

    // Add a conditional column for selectedWeek if it's available
    if (selectedWeek !== null) {
      const weekRankColumn: ColumnDef<Player> = {
        id: "week_rank",
        accessorFn: (row) => row.rankings_dict[selectedWeek],
        header: ({ column }: any) => <SortHeader column={column} title="Game Rank" />,
        cell: ({ row }: any) => row.original.rankings_dict[selectedWeek],
        // cell: ({ row }: any) => {
        //   const weekRank = row.original.rankings_dict[selectedWeek];
        //   return (<div className="text-center bg-[#F5F5F5] font-extrabold py-4 box-border">
        //     {weekRank}
        //   </div>);
        // },
        enableSorting: true,
      };
      dynamicCols.splice(1, 0, weekRankColumn);
    }

    return dynamicCols;
  }, [selectedWeek]);

  // Update player data when filters or the global filter change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...players];

      // Apply global search
      if (globalFilter) {
        result = result.filter((player) =>
          Object.values(player)
            .join(" ")
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        );
      }

      // Apply player number filter
      if (filters.playerNumber) {
        result = result.filter((player) =>
          player.number.toString().includes(filters.playerNumber)
        );
      }

      // Apply position filter
      if (filters.position) {
        result = result.filter((player) =>
          player.position.toLowerCase().includes(filters.position.toLowerCase())
        );
      }

      // Apply range filter for season rank or experience
      if (filters.rangeFilter.type && filters.rangeFilter.range.from && filters.rangeFilter.range.to) {
        const { type, range } = filters.rangeFilter;
        if (type === "experience") {
          result = result.filter(
            (player) =>
              player.experience >= range.from &&
              player.experience <= range.to
          );
        } else if (type === "seasonRank") {
          result = result.filter(
            (player) =>
              player.season_rank >= range.from &&
              player.season_rank <= range.to
          );
        }
      }

      setFilteredPlayers(result);
    };

    applyFilters();
  }, [players, globalFilter, filters]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/players", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        // Transform data to parse rankings_dict
        const players: Player[] = data.map((player: any) => ({
          ...player,
          rankings_dict: JSON.parse(player.rankings_dict),
        }));

        setPlayers(players);
        setFilteredPlayers(players);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const setPlayerNumberFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, playerNumber: value }));
  };

  const setPositionFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, position: value }));
  };

  const applyRangeFilter = (filterType: string, range: { from: number; to: number }) => {
    setFilters((prev) => ({
      ...prev,
      rangeFilter: { type: filterType, range },
    }));
  };

  const clearFilters = () => {
    setFilters({
      playerNumber: "",
      position: "",
      rangeFilter: { type: "", range: { from: 0, to: 0 } },
    });
  };

  return (
    <div className="">
      {/* FilterBar */}
      <FilterBar
        toggleSidebar={toggleSidebar}
        isSidebarVisible={isSidebarVisible}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        onDownloadCSV={downloadCSV}
      />

      <div className="flex">
        {/* Sidebar */}
        {isSidebarVisible && (
          <Sidebar
            applyRangeFilter={applyRangeFilter}
            setPlayerNumberFilter={setPlayerNumberFilter}
            setPositionFilter={setPositionFilter}
            clearFilters={clearFilters}
          />
        )}

        {/* DataTable */}
        <div className="flex-grow bg-gradient-to-l from-transparent to-black/40 bg-no-repeat">
          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <DataTable columns={dynamicColumns} data={filteredPlayers} globalFilter={globalFilter} selectedWeek={selectedWeek}
              onRowClick={(row: Player) => {
                setSelectedPlayer((current) => (current?.id === row.id ? null : row));
              }} />
          )}
        </div>

        {/* Player Details Panel */}
        {selectedPlayer && (
          <PlayerDetailsPanel
            player={selectedPlayer}
            selectedWeek={selectedWeek}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;
