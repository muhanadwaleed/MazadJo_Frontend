import type { ParticipantType, Subscription } from "../types/subscription";

/** Pick the current user's subscription from a list (API may return other participants). */
export function findSubscriptionForUser(
  results: Subscription[] | undefined,
  userId: number,
  participantType?: ParticipantType
): Subscription | null {
  if (!results?.length) return null;

  return (
    results.find((item) => {
      if (Number(item.user) !== Number(userId)) return false;
      if (participantType && item.participant_type !== participantType) return false;
      return true;
    }) ?? null
  );
}

export function findBidderSubscription(
  results: Subscription[] | undefined,
  userId: number
): Subscription | null {
  return findSubscriptionForUser(results, userId, "bidder");
}

export function findSellerSubscription(
  results: Subscription[] | undefined,
  userId: number
): Subscription | null {
  return findSubscriptionForUser(results, userId, "seller");
}
