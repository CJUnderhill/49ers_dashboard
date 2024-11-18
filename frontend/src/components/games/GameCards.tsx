"use client";
// components/GameCards.tsx
import React, { useEffect, useState } from "react";
import Header from '../header/Header';
import Game from '../../types/game';

interface GameCardsProps {
  selectedWeek: number | null;
  setSelectedWeek: (week: number | null) => void;
  jwtToken: string | null;
}

const GameCards: React.FC<GameCardsProps> = ({ selectedWeek, setSelectedWeek, jwtToken }) => {
  const [games, setGames] = useState<Game[]>([]); // State to store game data
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/games", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Game[] = await response.json();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleCardClick = (week: number) => {
    setSelectedWeek(selectedWeek === week ? null : week);
  };

  return (
    <div className="bg-gradient-to-r from-transparent to-black/50 bg-no-repeat pb-[30px]">
      <Header />
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-row whitespace-nowrap text-black">
          {loading && <div>Loading games...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && games.length === 0 && <div>No games available.</div>}
          {games.map((game) => (
            <div
              key={game.week}
              onClick={() => handleCardClick(game.week)}
              className={`px-[10px] py-[20px] mx-[15px] mt-[30px] basis-40 shrink-0 h-[240px] text-center rounded-[10px] flex flex-col justify-between cursor-pointer ${selectedWeek === game.week ? "bg-white" : "bg-[#b3995d]"
                }`}
            >
              <div className="uppercase text-[11px] font-normal">{formatDate(game.date)}</div>
              <div className="uppercase text-[11px] font-bold">{game.location}</div>
              <div className="flex justify-center items-center">
                <OpponentLogo name={game.opponent} />
              </div>
              <div className="uppercase text-[11px] font-bold">VS</div>
              <OpponentName opponent={game.opponent} />
              <Score score={game.score} opp_score={game.opponent_score} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

const OpponentName: React.FC<{ opponent: string }> = ({ opponent }) => {
  const components = opponent.split(" ");
  const first = components.slice(0, -1).join(" "); // All except last
  const last = components[components.length - 1]; // Last

  return (
    <div className="flex flex-col">
      <div className="uppercase text-[18px]">{first}</div>
      <div className="uppercase text-[18px] font-bold">{last}</div>
    </div>
  );
};

const Score: React.FC<{ score: number, opp_score: number }> = ({ score, opp_score }) => {
  const result = score > opp_score ? "W" : "L";

  return (
    <div className="uppercase text-[18px] bottom-0">
      <span className="font-bold">{result} </span><span>{score}-{opp_score}</span>
    </div>
  );
};

const OpponentLogo: React.FC<{ name: string }> = ({ name }) => {

  const logoFile = (() => {
    switch (name.toLowerCase()) {
      case "pittsburgh steelers":
        return "logo_pittsburghsteelers.svg";
      case "los angeles rams":
        return "logo_losangelesrams.svg";
      case "new york giants":
        return "logo_newyorkgiants.svg";
      case "arizona cardinals":
        return "logo_arizonacardinals.svg";
      case "dallas cowboys":
        return "logo_dallascowboys.svg";
      case "cleveland browns":
        return "logo_clevelandbrowns.svg";
      case "minnesota vikings":
        return "logo_minnesotavikings.svg";
      case "cincinnati bengals":
        return "logo_cincinnatibengals.svg";
      case "jacksonville jaguars":
        return "logo_jacksonvillejaguars.svg";
      case "tampa bay buccaneers":
        return "logo_tampabaybuccaneers.svg";
      case "seattle seahawks":
        return "logo_seattleseahawks.svg";
      case "philadelphia eagles":
        return "logo_philadelphiaeagles.svg";
      case "baltimore ravens":
        return "logo_baltimoreravens.svg";
      case "washington commanders":
        return "logo_washingtoncommanders.svg";
      case "green bay packers":
        return "logo_greenbaypackers.svg";
      case "detroit lions":
        return "logo_detroitlions.svg";
      case "kansas city chiefs":
        return "logo_kansascitychiefs.svg";
      default:
        return "logo_unknown.svg";
    }
  })();

  const src = "/images/logos/" + logoFile;
  const altText = name + " logo";

  return (
    <img
      src={src}
      alt={altText}
      className="size-[60px]"
    />
  );
};

export function formatGameResult(score1: number, score2: number): string {

  const result = score1 > score2 ? "W" : "L";
  return `${result} ${score1}-${score2}`;
}


export default GameCards;
