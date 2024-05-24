import {
  Report,
  Period,
  ReportGenerator,
  ReportsGenerator
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

export type CarExpensesCalculator = CarExpenses & ReportGenerator

export function buildCarExpensesCalculator(
  config: CarExpenses
): CarExpensesCalculator {
  let generateReports: ReportsGenerator

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

function upfrontOnlyCalculator(config: CarUpfrontOnly): ReportsGenerator {
  return function (period: Period): ReadonlyArray<Report> {
    const reports: Report[] = []

    if (doesPeriodAndDateMatch(config.date, period)) {
      const report = buildCarReport({
        period,
        amount: config.upfront,
        component: UPFRONT_PAYMENT_CATEGORY
      })

      reports.push(report)
    }

    return reports
  }
}

function monthlyRateAndUpfrontCalculator(
  config: CarMonthlyRateAndUpfront
): ReportsGenerator {
  return function (period: Period): ReadonlyArray<Report> {
    const reports: Report[] = []

    if (
      isPeriodIncludedInInterval(period, {
        start: config.startDate,
        durationInMonths: config.duration
      })
    ) {
      const report = buildCarReport({
        period,
        amount: config.monthlyRate,
        component: MONTHLY_RATE_CATEGORY
      })

      reports.push(report)
    }

    if (doesPeriodAndDateMatch(config.startDate, period)) {
      const report = buildCarReport({
        period,
        amount: config.upfront,
        component: UPFRONT_PAYMENT_CATEGORY
      })

      reports.push(report)
    }

    return reports
  }
}

function monthlyRateCalculator(config: CarMonthlyRateOnly): ReportsGenerator {
  return function (period: Period): ReadonlyArray<Report> {
    const reports: Report[] = []

    if (
      isPeriodIncludedInInterval(period, {
        start: config.startDate,
        durationInMonths: config.duration
      })
    ) {
      reports.push(
        buildCarReport({
          period,
          amount: config.monthlyRate,
          component: MONTHLY_RATE_CATEGORY
        })
      )
    }

    return reports
  }
}

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
  data: Pick<Report, "amount" | "component" | "period">
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

export const CAR_CATEGORY = "Car"
export const UPFRONT_PAYMENT_CATEGORY = "UpfrontPayment"
export const MONTHLY_RATE_CATEGORY = "MonthlyRate"

export type CarComponents =
  | typeof UPFRONT_PAYMENT_CATEGORY
  | typeof MONTHLY_RATE_CATEGORY
