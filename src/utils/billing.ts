/**
 * All monetary values are stored as whole rupees.
 * Hourly rates are rupees per hour.
 */

export function calculateSessionAmount(
  ratePerHour: number,
  elapsedSeconds: number,
  pausedSeconds: number,
  gracePeriodMinutes: number,
): number {
  const billableSeconds = Math.max(
    0,
    elapsedSeconds - pausedSeconds - gracePeriodMinutes * 60,
  );

  if (billableSeconds === 0 || ratePerHour <= 0) {
    return 0;
  }

  const rawAmount = (ratePerHour * billableSeconds) / 3600;

  // Always round up to the next whole rupee.
  return Math.ceil(rawAmount);
}

export function calculateBillTotal(
  sessionAmount: number,
  foodAmount: number,
): number {
  return Math.max(0, sessionAmount) + Math.max(0, foodAmount);
}
