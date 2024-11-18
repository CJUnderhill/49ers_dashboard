"use client";
import React, { useEffect, useState } from 'react';
import GameCards from '../components/games/GameCards';
import PlayerInfo from '../components/playerinfo/PlayerInfo';
import getAuthToken from '@/lib/auth';

const Home: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await getAuthToken();
      setJwtToken(response);
    };

    fetchToken();
  }, []);

  if (!jwtToken) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GameCards selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} jwtToken={jwtToken} />
      <PlayerInfo selectedWeek={selectedWeek} jwtToken={jwtToken} />
    </div>
  );
};

export default Home;
