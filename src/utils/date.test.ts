import {isSamePeriod} from "./date.ts"
import {Period} from "../model/monthly-report.ts"
import {isPeriodBetweenStartAndEnd} from "./date"

describe("isSamePeriod", () => {
  it("should return true if the dates are in the same period", () => {
    // Given
    const year = 2022
    const month = 1

    const period1: Period = {
      year,
      month
    }

    const period2: Period = {
      year,
      month
    }

    // When
    const result = isSamePeriod(period1, period2)

    // Then
    expect(result).toBe(true)
  })

  it("should return false if the dates are in different periods", () => {
    // Given
    const year1 = 2022
    const month1 = 1
    const year2 = 2023
    const month2 = 2

    const period1: Period = {
      year: year1,
      month: month1
    }

    const period2: Period = {
      year: year2,
      month: month2
    }

    // When
    const result = isSamePeriod(period1, period2)

    // Then
    expect(result).toBe(false)
  })
})

describe("isPeriodBetweenStartAndEnd", () => {
  it("should return true if the period is between the start and end periods (inclusive)", () => {
    // Given
    const period = {year: 2023, month: 2}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end)

    // Expect
    expect(result).toBe(true)
  })

  it("should return true if the period is equal to the start period (inclusive)", () => {
    // Given
    const period = {year: 2023, month: 1}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end, {includeStart: true})

    // Expect
    expect(result).toBe(true)
  })

  it("should return true if the period is equal to the end period (inclusive)", () => {
    // Given
    const period = {year: 2023, month: 3}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end, {includeEnd: true})

    // Expect
    expect(result).toBe(true)
  })

  it("should return false if the period is before the start period", () => {
    // Given
    const period = {year: 2023, month: 1}
    const start = {year: 2023, month: 2}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end)

    // Expect
    expect(result).toBe(false)
  })

  it("should return false if the period is after the end period", () => {
    // Given
    const period = {year: 2023, month: 4}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end)

    // Expect
    expect(result).toBe(false)
  })

  it("should handle different years correctly", () => {
    // Given
    const period = {year: 2024, month: 1}
    const start = {year: 2023, month: 12}
    const end = {year: 2024, month: 2}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end)

    // Expect
    expect(result).toBe(true)
  })

  it("should return false if the period is equal to the start period but includeStart is false", () => {
    // Given
    const period = {year: 2023, month: 1}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end, {includeStart: false})

    // Expect
    expect(result).toBe(false)
  })

  it("should return false if the period is equal to the end period but includeEnd is false", () => {
    // Given
    const period = {year: 2023, month: 3}
    const start = {year: 2023, month: 1}
    const end = {year: 2023, month: 3}

    // When
    const result = isPeriodBetweenStartAndEnd(period, start, end, {includeEnd: false})

    // Expect
    expect(result).toBe(false)
  })
})
