// Interface to represent house costs
import {MonthlyReport, Period} from "./monthly-report.ts"
import {computeMonthlyPaymentForFixedInterestRateLoan} from "../utils/finance.ts"

interface HouseCosts {
  totalHouseCost: number;
  ltvPercentage: number;
  interestRate: number;
  durationInYears: number;
  startDate: Date
}

export type HouseCostsCalculator = HouseCosts & {
  computeMonthlyReport: (period: Period) => MonthlyReport
}

export function buildHouseExpensesCalculator(config: HouseCosts): HouseCostsCalculator {
  return {
    ...config,
    computeMonthlyReport: computeMonthlyCosts(config)
  }
}

function computeMonthlyCosts(houseCosts: HouseCosts): (period: Period) => MonthlyReport {

  const rate = computeMonthlyPaymentForFixedInterestRateLoan({
    amount: houseCosts.totalHouseCost * houseCosts.ltvPercentage / 100,
    annualInterestRateInPercent: houseCosts.interestRate,
    durationInMonths: houseCosts.durationInYears * 12
  })

  const endPeriod = {
    year: houseCosts.startDate.getFullYear() + houseCosts.durationInYears,
    month: houseCosts.startDate.getMonth() - 1
  }

  return (period: Period) => {
    const isFirstPayment = period.year === houseCosts.startDate.getFullYear() &&
      period.month === houseCosts.startDate.getMonth()

    const isPeriodAfterOrEqualStartDate = period.year > houseCosts.startDate.getFullYear() || period.year === houseCosts.startDate.getFullYear() && period.month >= houseCosts.startDate.getMonth()
    const isPeriodBeforeOrEqualEndPeriod = period.year < endPeriod.year || (period.year === endPeriod.year && period.month <= endPeriod.month)
    const isPeriodInPayment = isPeriodAfterOrEqualStartDate && isPeriodBeforeOrEqualEndPeriod

    const downPayment = isFirstPayment ? houseCosts.totalHouseCost * (1 - houseCosts.ltvPercentage / 100) : 0
    const monthlyPayment = isPeriodInPayment ? rate : 0

    return {
      period,
      totalExpenses: downPayment + monthlyPayment,
      component: HOUSE_COMPONENT,
      totalIncome: 0,
      detailedExpenses: {
        ...(downPayment > 0 ? {downPayment} : {}),
        ...(monthlyPayment > 0 ? {monthlyPayment} : {})
      }
    }
  }
}

const HOUSE_COMPONENT = "House"
