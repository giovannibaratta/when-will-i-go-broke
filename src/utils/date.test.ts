import {isSamePeriod} from "./date.ts"
import {Period} from "../model/monthly-report.ts"

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
