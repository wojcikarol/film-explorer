export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
}

export interface RamInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RamResponse {
  info: RamInfo;
  results: Character[];
}