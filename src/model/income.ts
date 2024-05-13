import {Month, MonthlyReport, Period} from "./monthly-report.ts"

interface Income {
  readonly monthlyNetRate: number,
  readonly tredicesima: boolean,
  readonly quattordicesima: boolean,

  readonly growth: GrowthOptions
}

export type GrowthOptions = Disabled | YearlyGrowth

interface Disabled {
  readonly type: "disabled"
}

interface YearlyGrowth {
  readonly type: "yearly",
  readonly annualPercentageGrowth: number
  readonly startDate: Date
}

export type IncomeCalculator = Income & {
  readonly computeMonthlyReport: (period: Period) => MonthlyReport
}

export function buildIncomeCalculator(config: Partial<Income>): IncomeCalculator {

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
    computeMonthlyReport: calculateIncomeFor(mergedConfig)
  }
}

const computeBasePayMultiplier = (period: Period, growth: GrowthOptions): number => {
  if (growth.type == "yearly") {
    const startYear = growth.startDate.getFullYear()
    const startMonth = growth.startDate.getMonth()

    const annualGrowthRate = growth.annualPercentageGrowth / 100
    const monthsSinceStart = (period.year - startYear) * 12 + (period.month - startMonth)

    return Math.pow(1 + annualGrowthRate, monthsSinceStart / 12)
  }

  // Growth disabled
  return 1
}

const calculateIncomeFor = (config: Income) => {
  return function(period: Period): MonthlyReport {
    const basePayMultiplier = computeBasePayMultiplier(period, config.growth)
    const basePay = config.monthlyNetRate * basePayMultiplier

    let additionalPay = 0

    if (period.month == Month.December && config.tredicesima) {
      additionalPay += basePay
    }

    if (period.month == Month.July && config.quattordicesima) {
      additionalPay += basePay
    }

    return {
      totalIncome: basePay + additionalPay,
      totalExpenses: 0,
      detailedExpenses: {},
      period,
      component: INCOME_COMPONENT
    }
  }
}

const INCOME_COMPONENT = "Income"
