"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  findSubscriptionForUser,
  subscriptionsService,
  type ParticipantType,
  type Subscription,
} from "@mazad/api";

const POLL_MS = 2500;

type UseSubscriptionPollOptions = {
  auctionId: number;
  userId: number;
  participantType: ParticipantType;
  enabled?: boolean;
  onActive?: (subscription: Subscription) => void;
};

export function useSubscriptionPoll({
  auctionId,
  userId,
  participantType,
  enabled = true,
  onActive,
}: UseSubscriptionPollOptions) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(enabled);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  const refresh = useCallback(async () => {
    const data = await subscriptionsService.listClient({ auction: auctionId });
    const latest = findSubscriptionForUser(data.results, userId, participantType);
    setSubscription(latest);
    if (latest?.status === "active") {
      onActiveRef.current?.(latest);
    }
    return latest;
  }, [auctionId, participantType, userId]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const latest = await refresh();
        if (cancelled) return;
        if (latest?.status === "active") {
          setLoading(false);
          return;
        }
      } catch {
        if (!cancelled) setSubscription(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled || subscription?.status === "active") return;

    const timer = window.setInterval(() => {
      void refresh().catch(() => undefined);
    }, POLL_MS);

    return () => window.clearInterval(timer);
  }, [enabled, refresh, subscription?.status]);

  const isActive = subscription?.status === "active";
  const isPending = subscription?.status === "pending_payment";

  return { subscription, loading, isActive, isPending, refresh };
}
