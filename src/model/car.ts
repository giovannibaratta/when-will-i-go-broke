import {MonthlyReport, Period} from "./monthly-report.ts"
import {getFirstDayOfNextMonthsFrom} from "../utils/date.ts"

export type CarExpenses = CarMonthlyRateOnly | CarUpfrontOnly | CarMonthlyRateAndUpfront

interface CarMonthlyRateOnly {
  type: "CarMonthlyRateOnly"
  monthlyRate: number
  duration: number
  startDate: Date
}

interface CarUpfrontOnly {
  type: "CarUpfrontOnly"
  date: Date
  upfront: number
}

interface CarMonthlyRateAndUpfront {
  type: "CarMonthlyRateAndUpfront"
  monthlyRate: number
  duration: number
  startDate: Date
  upfront: number
}

type CarCalculator = (period: Period) => MonthlyReport

export type CarExpensesCalculator = CarExpenses & {
  computeMonthlyReport: CarCalculator
}

export function buildCarExpensesCalculator(config: CarExpenses): CarExpensesCalculator {
  let calculator: CarExpensesCalculator

  switch (config.type) {
    case "CarMonthlyRateAndUpfront":
      calculator = {...config, computeMonthlyReport: monthlyRateAndUpfrontCalculator(config)}
      break
    case "CarUpfrontOnly":
      calculator = {...config, computeMonthlyReport: upfrontOnlyCalculator(config)}
      break
    case "CarMonthlyRateOnly":
      calculator = {...config, computeMonthlyReport: monthlyRateCalculator(config)}
      break
  }

  return calculator
}

function upfrontOnlyCalculator(config: CarUpfrontOnly): CarCalculator {
  return function(period: Period): MonthlyReport {
    const totalExpenses = doesPeriodAndDateMatch(config.date, period) ? config.upfront : 0
    return {
      period,
      totalExpenses,
      detailedExpenses: {
        ...(totalExpenses > 0 && {"upfront": totalExpenses})
      }
    }
  }
}

function monthlyRateAndUpfrontCalculator(config: CarMonthlyRateAndUpfront): CarCalculator {
  return function(period: Period): MonthlyReport {
    const monthlyRate = isPeriodIncludedInInterval(period, {
      start: config.startDate,
      durationInMonths: config.duration
    }) ? config.monthlyRate : 0

    const upfrontCost = doesPeriodAndDateMatch(config.startDate, period) ? config.upfront : 0

    return {
      period,
      totalExpenses: monthlyRate + upfrontCost,
      detailedExpenses: {
        ...(upfrontCost > 0 && {"upfront": upfrontCost}),
        ...(monthlyRate > 0 && {"monthlyRate": monthlyRate})
      }
    }

  }
}

function monthlyRateCalculator(config: CarMonthlyRateOnly): CarCalculator {
  return function(period: Period): MonthlyReport {
    const totalExpenses = isPeriodIncludedInInterval(period, {
      start: config.startDate,
      durationInMonths: config.duration
    }) ? config.monthlyRate : 0
    return {
      period,
      totalExpenses,
      detailedExpenses: {
        ...(totalExpenses > 0 && {"monthlyRate": totalExpenses})
      }
    }
  }
}

function isPeriodIncludedInInterval(period: Period, interval: {start: Date, durationInMonths: number}): boolean {
  const startInterval = interval.start
  const endInterval = getFirstDayOfNextMonthsFrom(startInterval, interval.durationInMonths)
  const isPeriodEqualOrAfterStart = period.year > startInterval.getFullYear() || (startInterval.getFullYear() == period.year && period.month >= startInterval.getMonth())
  const isPeriodBeforeEnd = period.year < endInterval.getFullYear() || (endInterval.getFullYear() == period.year && period.month < endInterval.getMonth())
  return isPeriodEqualOrAfterStart && isPeriodBeforeEnd
}

function doesPeriodAndDateMatch(date: Date, period: Period): boolean {
  return date.getFullYear() === period.year && date.getMonth() === period.month
}
