import {Period} from "../model/monthly-report.ts"

export function getFirstDayOfNextMonthsFrom(now: Date, numberOfMonths: number): Date {
  console.assert(numberOfMonths > 0)
  const currentMonth = now.getMonth()
  const targetMonth = currentMonth + numberOfMonths

  const yearIncrements = targetMonth % 12
  const newYear = yearIncrements < 0 ? now.getFullYear() : now.getFullYear() + yearIncrements
  const newMonth = yearIncrements < 0 ? targetMonth : targetMonth - (12 * yearIncrements)

  return new Date(newYear, newMonth, 1)
}

export function isSamePeriod(period1: Period, period2: Period): boolean {
  return period1.year === period2.year && period1.month === period2.month
}

export function isPeriodBetweenStartAndEnd(period: Period, start: Period, end: Period, config ?: {
  includeStart?: boolean,
  includeEnd?: boolean
}): boolean {

  const includeStart = config?.includeStart ?? false
  const includeEnd = config?.includeEnd ?? false

  const isSameAsStart = isSamePeriod(period, start)
  const isSameAsEnd = isSamePeriod(period, end)
  const isAfterStart = period.year > start.year || (period.year === start.year && period.month > start.month)
  const isBeforeEnd = period.year < end.year || (period.year === end.year && period.month < end.month)

  return (isAfterStart && isBeforeEnd) ||
    (isSameAsStart && includeStart) ||
    (isSameAsEnd && includeEnd)
}

export const dateToPeriod = (date: Date): Period => {
  return {
    year: date.getFullYear(),
    month: date.getMonth()
  }
}

export const addMonthsToPeriod = (period: Period, monthsToAdd: number): Period => {
  if (monthsToAdd < 0) throw new RangeError("Months must be positive or equal to 0")

  const currentSlot = period.year * 12 + period.month
  const newSlot = currentSlot + monthsToAdd

  const newYear = Math.floor(newSlot / 12)
  const newMonth = newSlot % 12

  return {
    year: newYear,
    month: newMonth
  }
}
