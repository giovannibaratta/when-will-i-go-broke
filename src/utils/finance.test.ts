import {computeMonthlyPaymentForFixedInterestRateLoan} from "./finance.ts"

describe("computeMonthlyPaymentForFixedInterestRateLoan", () => {
  it("should calculate monthly payment for a loan with 0% interest rate", () => {
    // Given
    const loan = {
      amount: 100000,
      annualInterestRateInPercent: 0,
      durationInMonths: 120
    }

    // When
    const monthlyPayment = computeMonthlyPaymentForFixedInterestRateLoan(loan)

    // Expect
    expect(monthlyPayment).toBeCloseTo(833.33)
  })

  it("should calculate monthly payment for a loan with 5% interest rate", () => {
    // Given
    const loan = {
      amount: 100000,
      annualInterestRateInPercent: 5,
      durationInMonths: 120
    }

    // When
    const monthlyPayment = computeMonthlyPaymentForFixedInterestRateLoan(loan)

    // Expect
    expect(monthlyPayment).toBeCloseTo(1060.66)
  })

  it("should throw an error if the loan amount is negative", () => {
    // Given
    const loan = {
      amount: -100000,
      annualInterestRateInPercent: 5,
      durationInMonths: 120
    }

    // Expect
    expect(() => computeMonthlyPaymentForFixedInterestRateLoan(loan)).toThrow(
      "Amount must be positive or equal to zero"
    )
  })

  it("should throw an error if the annual interest rate is negative", () => {
    // Given
    const loan = {
      amount: 100000,
      annualInterestRateInPercent: -5,
      durationInMonths: 120
    }

    // Expect
    expect(() => computeMonthlyPaymentForFixedInterestRateLoan(loan)).toThrow(
      "Annual interest rate must be positive or equal to zero"
    )
  })

  it("should throw an error if the duration in months is negative", () => {
    // Given
    const loan = {
      amount: 100000,
      annualInterestRateInPercent: 5,
      durationInMonths: -120
    }

    // Expect
    expect(() => computeMonthlyPaymentForFixedInterestRateLoan(loan)).toThrow(
      "Duration must be positive or equal to zero"
    )
  })
})
