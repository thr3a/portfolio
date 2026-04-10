export type Level = 'easy' | 'normal' | 'hard';

export type PersonType = 'knight' | 'knave';

export type Statement = {
  type: string;
  speaker: string;
  target: string | null;
  target2?: string | null;
  claimed_is_knight?: boolean | null;
  n?: number | null;
  condition_knight?: boolean | null;
  conclusion_knight?: boolean | null;
};

export type PuzzleGenerateRequest = {
  num_persons: number;
  level: Level;
};

export type PuzzleResponse = {
  version: string;
  level: string;
  num_persons: number;
  persons: string[];
  statements: Statement[];
  solution: Record<string, PersonType>;
  statements_text: string[];
};

export type UserAnswers = Record<string, PersonType | null>;
