// Interface to represent house costs
import {MonthlyReport, Period} from "./monthly-report.ts"

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

// Formula for computing monthly payment for fixed interest rates
// M = P [ I(1 + I)^N ] / [ (1 + I)^N − 1]
// M = Monthly payment
// P = Principal amount
// I = monthly Interest rate
// N = Number of payments
function computeMonthlyCosts(houseCosts: HouseCosts): (period: Period) => MonthlyReport {

  // Principal amount
  const p = houseCosts.totalHouseCost * houseCosts.ltvPercentage / 100
  // monthly interest rate
  const i = houseCosts.interestRate / 100 / 12
  // number of payments
  const n = houseCosts.durationInYears * 12
  // monthly payment
  const m = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)

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
    const monthlyPayment = isPeriodInPayment ? m : 0
    
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
