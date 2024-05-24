import {
  Report,
  Period,
  Calculator,
  PeriodCalculator,
  ExpenseReport
} from "./monthly-report.ts"
import {
  dateToPeriod,
  getFirstDayOfNextMonthsFrom,
  isPeriodBetweenStartAndEnd,
  isSamePeriod
} from "../utils/date.ts"

export type CarExpenses =
  | CarMonthlyRateOnly
  | CarUpfrontOnly
  | CarMonthlyRateAndUpfront

export interface CarMonthlyRateOnly {
  type: "CarMonthlyRateOnly"
  monthlyRate: number
  duration: number
  startDate: Date
}

export interface CarUpfrontOnly {
  type: "CarUpfrontOnly"
  date: Date
  upfront: number
}

export interface CarMonthlyRateAndUpfront {
  type: "CarMonthlyRateAndUpfront"
  monthlyRate: number
  duration: number
  startDate: Date
  upfront: number
}

export type CarExpensesCalculator = CarExpenses & Calculator

export function buildCarExpensesCalculator(
  config: CarExpenses
): CarExpensesCalculator {
  let generateReports: PeriodCalculator

  switch (config.type) {
    case "CarMonthlyRateAndUpfront":
      generateReports = monthlyRateAndUpfrontCalculator(config)
      break
    case "CarUpfrontOnly":
      generateReports = upfrontOnlyCalculator(config)
      break
    case "CarMonthlyRateOnly":
      generateReports = monthlyRateCalculator(config)
      break
  }

  return {
    ...config,
    generateReports
  }
}

function upfrontOnlyCalculator(config: CarUpfrontOnly): PeriodCalculator {
  return function (period: Period): ReadonlyArray<Report> {
    const totalExpenses = doesPeriodAndDateMatch(config.date, period)
      ? config.upfront
      : 0

    const reports: Report[] = []

    if (totalExpenses > 0) {
      const report = buildCarReport({
        period,
        amount: totalExpenses,
        component: UPFRONT_PAYMENT
      })

      reports.push(report)
    }

    return reports
  }
}

function monthlyRateAndUpfrontCalculator(
  config: CarMonthlyRateAndUpfront
): PeriodCalculator {
  return function (period: Period): ReadonlyArray<Report> {
    const monthlyRate = isPeriodIncludedInInterval(period, {
      start: config.startDate,
      durationInMonths: config.duration
    })
      ? config.monthlyRate
      : 0

    const upfrontCost = doesPeriodAndDateMatch(config.startDate, period)
      ? config.upfront
      : 0

    const reports: Report[] = []

    if (monthlyRate > 0) {
      const report = buildCarReport({
        period,
        amount: monthlyRate,
        component: MONTHLY_RATE
      })

      reports.push(report)
    }

    if (upfrontCost > 0) {
      const report = buildCarReport({
        period,
        amount: upfrontCost,
        component: UPFRONT_PAYMENT
      })

      reports.push(report)
    }

    return reports
  }
}

function monthlyRateCalculator(config: CarMonthlyRateOnly): PeriodCalculator {
  return function (period: Period): ReadonlyArray<Report> {
    const totalExpenses = isPeriodIncludedInInterval(period, {
      start: config.startDate,
      durationInMonths: config.duration
    })
      ? config.monthlyRate
      : 0

    const reports: Report[] = []

    if (totalExpenses > 0) {
      reports.push(
        buildCarReport({
          period,
          amount: totalExpenses,
          component: MONTHLY_RATE
        })
      )
    }

    return reports
  }
}

export const CAR_CATEGORY = "Car"
const UPFRONT_PAYMENT = "UPFRONT_PAYMENT"
const MONTHLY_RATE = "MONTHLY_RATE"

export type CarComponents = typeof UPFRONT_PAYMENT | typeof MONTHLY_RATE

function isPeriodIncludedInInterval(
  period: Period,
  interval: {start: Date; durationInMonths: number}
): boolean {
  const startPeriod = dateToPeriod(interval.start)
  const endPeriod = dateToPeriod(
    getFirstDayOfNextMonthsFrom(interval.start, interval.durationInMonths)
  )

  return isPeriodBetweenStartAndEnd(period, startPeriod, endPeriod, {
    includeStart: true,
    includeEnd: false
  })
}

function doesPeriodAndDateMatch(date: Date, period: Period): boolean {
  return isSamePeriod(dateToPeriod(date), period)
}

function buildCarReport(
  data: Pick<ExpenseReport, "amount" | "component" | "period">
): Report {
  const {amount, component, period} = data

  return {
    category: CAR_CATEGORY,
    type: "Expense",
    amount,
    component,
    period
  }
}
