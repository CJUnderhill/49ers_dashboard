"use client"

import { ColumnDef } from "@tanstack/react-table"
import Player from '../../types/player';
import React from 'react';
import { SortHeader } from "./SortHeader";


export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: 'season_rank',
    header: ({ column }) => <SortHeader column={column} title="Season Rank" />,
  },
  {
    accessorKey: 'number',
    header: ({ column }) => <SortHeader column={column} title="#" />,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => <SortHeader column={column} title="First Name" />,
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => <SortHeader column={column} title="Last Name" />,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => <SortHeader column={column} title="Pos" />,
  },
  {
    accessorKey: 'height',
    header: ({ column }) => <SortHeader column={column} title="Ht" />,
  },
  {
    accessorKey: 'weight',
    header: ({ column }) => <SortHeader column={column} title="Wt" />,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <SortHeader column={column} title="Age" />,
  },
  {
    accessorKey: 'experience',
    header: ({ column }) => <SortHeader column={column} title="Exp" />,
  },
  {
    accessorKey: 'college',
    header: ({ column }) => <SortHeader column={column} title="College" />,
  },
]
