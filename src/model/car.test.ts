import {
  buildCarExpensesCalculator,
  CAR_CATEGORY,
  CarMonthlyRateAndUpfront,
  CarMonthlyRateOnly,
  CarUpfrontOnly,
  MONTHLY_RATE_CATEGORY,
  UPFRONT_PAYMENT_CATEGORY
} from "./car.ts"
import {Period} from "./monthly-report.ts"
import {dateToPeriod} from "../utils/date.ts"

describe("buildCarExpensesCalculator", () => {
  it("should calculate the monthly report for CarMonthlyRateOnly when the loan is still ongoing", () => {
    // Given
    const config: CarMonthlyRateOnly = {
      type: "CarMonthlyRateOnly",
      monthlyRate: 100,
      duration: 12,
      startDate: new Date(2023, 10, 1)
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2023, 10, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(1)
    expect(reports[0]).toMatchObject({
      category: CAR_CATEGORY,
      period,
      type: "Expense",
      amount: config.monthlyRate,
      component: MONTHLY_RATE_CATEGORY
    })
  })

  it("should calculate the monthly report for CarMonthlyRateOnly when the loan is terminated", () => {
    // Given
    const config: CarMonthlyRateOnly = {
      type: "CarMonthlyRateOnly",
      monthlyRate: 100,
      duration: 12,
      startDate: new Date(2023, 10, 1)
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2024, 10, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(0)
  })

  it("should calculate monthly report for CarUpfrontOnly when period is the same as the date", () => {
    // Given
    const config: CarUpfrontOnly = {
      type: "CarUpfrontOnly",
      date: new Date(2023, 10, 10),
      upfront: 1000
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2023, 10, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(1)
    expect(reports[0]).toMatchObject({
      category: CAR_CATEGORY,
      period,
      type: "Expense",
      amount: config.upfront,
      component: UPFRONT_PAYMENT_CATEGORY
    })
  })

  it("should calculate monthly report for CarUpfrontOnly when period is not the same as the date", () => {
    // Given
    const config: CarUpfrontOnly = {
      type: "CarUpfrontOnly",
      date: new Date(2023, 10, 10),
      upfront: 1000
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2023, 11, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(0)
  })

  it("should calculate monthly report for CarMonthlyRateAndUpfront for the first period", () => {
    // Given
    const config: CarMonthlyRateAndUpfront = {
      type: "CarMonthlyRateAndUpfront",
      monthlyRate: 100,
      duration: 12,
      startDate: new Date(2023, 10, 1),
      upfront: 1000
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2023, 10, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(2)
    expect(reports).toContainEqual(
      expect.objectContaining({
        type: "Expense",
        amount: config.monthlyRate,
        category: CAR_CATEGORY,
        component: MONTHLY_RATE_CATEGORY,
        period
      })
    )
    expect(reports).toContainEqual(
      expect.objectContaining({
        type: "Expense",
        amount: config.upfront,
        category: CAR_CATEGORY,
        component: UPFRONT_PAYMENT_CATEGORY,
        period
      })
    )
  })

  it(
    "should calculate monthly report for CarMonthlyRateAndUpfront for the " +
      "subsequent periods when the period is within the loan duration",
    () => {
      // Given
      const config: CarMonthlyRateAndUpfront = {
        type: "CarMonthlyRateAndUpfront",
        monthlyRate: 100,
        duration: 12,
        startDate: new Date(2023, 10, 1),
        upfront: 1000
      }
      const calculator = buildCarExpensesCalculator(config)
      const period: Period = dateToPeriod(new Date(2023, 11, 1))

      // When
      const reports = calculator.generateReports(period)

      // Then
      expect(reports).toHaveLength(1)
      expect(reports).toContainEqual(
        expect.objectContaining({
          type: "Expense",
          amount: config.monthlyRate,
          category: CAR_CATEGORY,
          component: MONTHLY_RATE_CATEGORY,
          period
        })
      )
    }
  )

  it("should calculate monthly report for CarMonthlyRateAndUpfront when the period is outside the loan duration", () => {
    // Given
    const config: CarMonthlyRateAndUpfront = {
      type: "CarMonthlyRateAndUpfront",
      monthlyRate: 100,
      duration: 12,
      startDate: new Date(2023, 10, 1),
      upfront: 1000
    }
    const calculator = buildCarExpensesCalculator(config)
    const period: Period = dateToPeriod(new Date(2024, 10, 1))

    // When
    const reports = calculator.generateReports(period)

    // Then
    expect(reports).toHaveLength(0)
  })
})
