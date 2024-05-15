/**
 * Compute monthly payment for fixed interest rate loan
 * @param loan
 */
export const computeMonthlyPaymentForFixedInterestRateLoan = (loan: {
  amount: number,
  annualInterestRateInPercent: number,
  durationInMonths: number,
}): number => {

  const {amount, annualInterestRateInPercent, durationInMonths} = loan

  // Formula for computing monthly payment for fixed interest rates
  // M = P [ I(1 + I)^N ] / [ (1 + I)^N − 1]
  // M = Monthly payment
  // P = Principal amount
  // I = monthly Interest rate
  // N = Number of payments

  // Principal amount
  const p = amount
  // monthly interest rate
  const i = annualInterestRateInPercent / 100 / 12
  // number of payments
  const n = durationInMonths
  // monthly payment
  const m = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)

  return m
}
