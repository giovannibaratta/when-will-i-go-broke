import {addMonthsToPeriod, getFirstDayOfNextMonthsFrom, isSamePeriod} from "./date.ts"
import {Month, Period} from "../model/monthly-report.ts"
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

// addMonthsToPeriod.test.ts

describe("addMonthsToPeriod", () => {
  it("should add a year if the starting month is December", () => {
    // Given
    const period = {year: 2023, month: Month.December}

    // When
    const result = addMonthsToPeriod(period, 1)

    // Expect
    expect(result).toEqual({year: 2024, month: Month.January})
  })

  it("should handle adding months across years", () => {
    // Given
    const period = {year: 2023, month: Month.November}
    const monthsToAdd = 14

    // When
    const result = addMonthsToPeriod(period, monthsToAdd)

    // Expect
    expect(result).toEqual({year: 2025, month: Month.January})
  })

  it("should handle adding 0 months", () => {
    // Given
    const period = {year: 2023, month: Month.November}

    // When
    const result = addMonthsToPeriod(period, 0)

    // Expect
    expect(result).toEqual({year: 2023, month: Month.November})
  })

  it("should thrown an error if monthsToAdd is negative", () => {
    // Given
    const period = {year: 2023, month: Month.November}
    const monthsToAdd = -1

    // When
    const result = () => addMonthsToPeriod(period, monthsToAdd)

    // Expect
    expect(result).toThrow("Months must be positive or equal to 0")
  })
})

describe("getFirstDayOfNextMonthsFrom", () => {
  it("should return the first day of the next month when now is in the middle of the month", () => {
    // Given
    const now = new Date(2023, 10, 20)
    const numberOfMonths = 1

    // When
    const result = getFirstDayOfNextMonthsFrom(now, numberOfMonths)

    // Expect
    expect(result).toEqual(new Date(2023, 11, 1))
  })

  it("should return the first day of the next month when now is the first day of a month", () => {
    // Given
    const now = new Date(2023, 10, 1)
    const numberOfMonths = 1

    // When
    const result = getFirstDayOfNextMonthsFrom(now, numberOfMonths)

    // Expect
    expect(result).toEqual(new Date(2023, 11, 1))
  })

  it("should add a year if the numberOfMonths is greater than the remaining days of the year", () => {
    // Given
    const now = new Date(2023, 10, 20)
    const numberOfMonths = 15

    // When
    const result = getFirstDayOfNextMonthsFrom(now, numberOfMonths)

    // Expect
    expect(result).toEqual(new Date(2025, 1, 1))
  })

  it("should throw an error when numberOfMonths is negative", () => {
    // Given
    const now = new Date(2023, 10, 20)
    const numberOfMonths = -1

    // When
    const result = () => getFirstDayOfNextMonthsFrom(now, numberOfMonths)

    // Expect
    expect(result).toThrow("Months must be positive or equal to 0")
  })
})
