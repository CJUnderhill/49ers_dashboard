// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex h-[110px] items-center justify-center text-white">
      <div className="flex min-w-[1000px] basis-1/2 justify-between h-full border-b-2 border-white border-opacity-20">
        <div className="basis-1/2 flex items-center justify-center">
          <img src="/images/logos/logo_sanfrancisco49ers.svg" alt="49ers logo" className="size-[60px]" />
          <h1 className="pl-[20px] text-[45px] font-sans font-light">San Francisco 49ers</h1>
        </div>
        <div className="basis-1/2 flex items-center justify-end">
          <h3 className="text-[18px] font-sans font-regular text-right uppercase tracking-[3.6px]">2023-2024 Season</h3>
        </div>
      </div>
    </header>
  );
};

export default Header;
