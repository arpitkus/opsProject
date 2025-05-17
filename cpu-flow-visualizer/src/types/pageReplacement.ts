
export interface PageReference {
  id: string;
  value: number;
}

export interface PageFrame {
  id: string;
  value: number | null;
  isHit: boolean;
  isNewlyLoaded: boolean;
}

export interface PageReplacementResult {
  frames: PageFrame[][];
  hits: number;
  faults: number;
  hitRatio: number;
}

export type PageReplacementAlgorithmType = 'fifo' | 'lru' | 'opt' | 'mru';

export interface PageReplacementStep {
  referenceIndex: number;
  frames: PageFrame[];
  isHit: boolean;
  replacedIndex: number | null;
  message: string;
}
