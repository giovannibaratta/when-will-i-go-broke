import {Month, Report, Period, ReportGenerator} from "./monthly-report.ts"

interface Income {
  readonly monthlyNetRate: number
  readonly tredicesima: boolean
  readonly quattordicesima: boolean

  readonly growth: GrowthOptions
}

export type GrowthOptions = Disabled | YearlyGrowth

interface Disabled {
  readonly type: "disabled"
}

interface YearlyGrowth {
  readonly type: "yearly"
  readonly annualPercentageGrowth: number
  readonly startDate: Date
}

export type IncomeCalculator = Income & ReportGenerator

export function buildIncomeCalculator(
  config: Partial<Income>
): IncomeCalculator {
  const defaultConfig: Income = {
    monthlyNetRate: 0,
    tredicesima: false,
    quattordicesima: false,
    growth: {
      type: "disabled"
    }
  }

  const mergedConfig = {
    ...defaultConfig,
    ...config
  }

  return {
    ...mergedConfig,
    generateReports: calculateIncomeFor(mergedConfig)
  }
}

const computeBasePayMultiplier = (
  period: Period,
  growth: GrowthOptions
): number => {
  if (growth.type == "yearly") {
    const startYear = growth.startDate.getFullYear()
    const startMonth = growth.startDate.getMonth()

    const annualGrowthRate = growth.annualPercentageGrowth / 100
    const monthsSinceStart =
      (period.year - startYear) * 12 + (period.month - startMonth)

    return Math.pow(1 + annualGrowthRate, monthsSinceStart / 12)
  }

  // Growth disabled
  return 1
}

const calculateIncomeFor = (config: Income) => {
  return function (period: Period): ReadonlyArray<Report> {
    const basePayMultiplier = computeBasePayMultiplier(period, config.growth)
    const basePay = config.monthlyNetRate * basePayMultiplier

    const reports: Report[] = []

    const basePayReport: Report = {
      type: "Income",
      amount: basePay,
      category: INCOME_CATEGORY,
      component: SALARY_COMPONENT,
      period
    }

    // Base pay
    reports.push(basePayReport)

    if (period.month == Month.December && config.tredicesima) {
      reports.push(basePayReport)
    }

    if (period.month == Month.July && config.quattordicesima) {
      reports.push(basePayReport)
    }

    return reports
  }
}

export const INCOME_CATEGORY = "Income"
export const SALARY_COMPONENT = "Salary"
export type IncomeComponents = typeof SALARY_COMPONENT
