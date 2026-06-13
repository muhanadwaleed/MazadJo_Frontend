/** Phase 8 — post-close counterparty ratings. */
export type Rating = {
  id: number;
  auction: number;
  rater: number;
  ratee: number;
  score: number;
  comment: string;
  created_at: string;
};

export type CreateRatingPayload = {
  auction: number;
  score: number;
  comment?: string;
};
