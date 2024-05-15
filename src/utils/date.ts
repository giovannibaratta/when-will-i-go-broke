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

export function isPeriodBetweenStartAndEnd(period: Period, start: Period, end: Period, config ?: {
  includeStart: boolean,
  includeEnd: boolean
}): boolean {

  const includeStart = config?.includeStart ?? false
  const includeEnd = config?.includeEnd ?? false

  const isSameAsStart = period.year === start.year && period.month === start.month
  const isSameAsEnd = period.year === end.year && period.month === end.month
  const isAfterStart = period.year > start.year || (period.year === start.year && period.month > start.month)
  const isBeforeEnd = period.year < end.year || (period.year === end.year && period.month < end.month)

  const isBetweenStartAndEnd = (isAfterStart && isBeforeEnd) ||
    (isSameAsStart && includeStart) ||
    (isSameAsEnd && includeEnd)

  return isBetweenStartAndEnd
}

export const dateToPeriod = (date: Date): Period => {
  return {
    year: date.getFullYear(),
    month: date.getMonth()
  }
}

export const addMonthsToPeriod = (period: Period, months: number): Period => {
  const newYear = period.year + Math.floor(months / 12)
  const newMonth = period.month + months % 12

  return {
    year: newYear,
    month: newMonth
  }
}
