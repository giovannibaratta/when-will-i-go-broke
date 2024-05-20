import {buildCarExpensesCalculator, CarMonthlyRateAndUpfront, CarMonthlyRateOnly, CarUpfrontOnly} from "./car.ts"
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(100)
    expect(monthlyReport.detailedExpenses).toEqual({monthlyRate: 100})
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(0)
    expect(monthlyReport.detailedExpenses).toEqual({})
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(1000)
    expect(monthlyReport.detailedExpenses).toEqual({upfront: 1000})
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(0)
    expect(monthlyReport.detailedExpenses).toEqual({})
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(1100)
    expect(monthlyReport.detailedExpenses).toEqual({upfront: 1000, monthlyRate: 100})
  })

  it("should calculate monthly report for CarMonthlyRateAndUpfront for the "
    + "subsequents periods when the period is within the loan duration", () => {
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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(100)
    expect(monthlyReport.detailedExpenses).toEqual({monthlyRate: 100})
  })

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
    const monthlyReport = calculator.computeMonthlyReport(period)

    // Then
    expect(monthlyReport.component).toBe("Car")
    expect(monthlyReport.totalIncome).toBe(0)
    expect(monthlyReport.period).toEqual(period)
    expect(monthlyReport.totalExpenses).toBe(0)
    expect(monthlyReport.detailedExpenses).toEqual({})
  })
})
