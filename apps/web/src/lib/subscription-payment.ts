import { env } from "@mazad/config";
import { subscriptionsService, type Subscription } from "@mazad/api";

export type PaymentMode = "simulate" | "gateway";

export function getPaymentMode(): PaymentMode {
  return env.paymentMode;
}

/**
 * Completes payment for a pending subscription.
 * Staging: mark_paid. Gateway: checkout redirect (future).
 */
export async function confirmSubscriptionPayment(
  subscription: Subscription
): Promise<Subscription> {
  if (subscription.status === "active") {
    return subscription;
  }

  const mode = getPaymentMode();

  if (mode === "simulate") {
    return subscriptionsService.markPaidClient(subscription.id);
  }

  const checkoutUrl = subscription.payment_transaction?.provider_reference;
  if (checkoutUrl?.startsWith("http")) {
    window.location.assign(checkoutUrl);
    return subscription;
  }

  throw new Error("gateway_not_configured");
}
