export default interface Game {
  id: number;
  date: Date;
  week: number;
  location: string;
  opponent: string;
  home: boolean;
  score: number;
  opponent_score: number;
}
