export interface Dimension {
  length?: number;
  width?: number;
}

export interface Room {
  name?: string;
  dimensions?: Dimension;
}
