// Interface to represent house costs
import {
  Report,
  Period,
  ReportGenerator,
  ReportsGenerator
} from "./monthly-report.ts"
import {computeMonthlyPaymentForFixedInterestRateLoan} from "../utils/finance.ts"
import {
  dateToPeriod,
  isPeriodBetweenStartAndEnd,
  isSamePeriod
} from "../utils/date.ts"

interface HouseCosts {
  totalHouseCost: number
  ltvPercentage: number
  interestRate: number
  durationInYears: number
  startDate: Date
}

export type HouseCostsCalculator = HouseCosts & ReportGenerator

export function buildHouseExpensesCalculator(
  config: HouseCosts
): HouseCostsCalculator {
  return {
    ...config,
    generateReports: generateReportsBuilder(config)
  }
}

function generateReportsBuilder(houseCosts: HouseCosts): ReportsGenerator {
  const rate = computeMonthlyPaymentForFixedInterestRateLoan({
    amount: (houseCosts.totalHouseCost * houseCosts.ltvPercentage) / 100,
    annualInterestRateInPercent: houseCosts.interestRate,
    durationInMonths: houseCosts.durationInYears * 12
  })

  const startPeriod = dateToPeriod(houseCosts.startDate)

  const endPeriod = {
    year: houseCosts.startDate.getFullYear() + houseCosts.durationInYears,
    month: houseCosts.startDate.getMonth()
  }

  return (period: Period) => {
    const isFirstPayment = isSamePeriod(period, startPeriod)

    const isMortgageStillActive = isPeriodBetweenStartAndEnd(
      period,
      startPeriod,
      endPeriod,
      {
        includeStart: true,
        includeEnd: false
      }
    )

    const reports: Report[] = []

    if (isFirstPayment) {
      const downPayment =
        houseCosts.totalHouseCost * (1 - houseCosts.ltvPercentage / 100)

      reports.push({
        period,
        component: DOWN_PAYMENT_COMPONENT,
        category: HOUSE_CATEGORY,
        amount: downPayment,
        type: "Expense"
      })
    }

    if (isMortgageStillActive) {
      reports.push({
        period,
        component: MONTHLY_PAYMENT_COMPONENT,
        category: HOUSE_CATEGORY,
        amount: rate,
        type: "Expense"
      })
    }

    return reports
  }
}

export const HOUSE_CATEGORY = "House"

export const DOWN_PAYMENT_COMPONENT = "DownPayment"
export const MONTHLY_PAYMENT_COMPONENT = "MonthlyPayment"

export type HouseComponents =
  | typeof DOWN_PAYMENT_COMPONENT
  | typeof MONTHLY_PAYMENT_COMPONENT
