export default interface Player {
  id: number;
  number: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: number;
  age: number;
  experience: number;
  college: string;
  description: string;
  season_rank: number;
  rankings_dict: Record<string, number>;
}