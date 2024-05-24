import {MonthlyReport, Period} from "./monthly-report.ts"
import {computeMonthlyPaymentForFixedInterestRateLoan} from "../utils/finance.ts"
import {
  addMonthsToPeriod,
  dateToPeriod,
  isPeriodBetweenStartAndEnd
} from "../utils/date.ts"

interface FurnitureCosts {
  kitchenCosts: number
  bathroomCosts: number
  livingRoomCosts: number
  bedroomCosts: number
  loanStartDate: Date
  loanDurationInMonths: number
  interestRatePercentage: number
}

export type FurnitureCostsCalculator = FurnitureCosts & {
  generateReports: (period: Period) => MonthlyReport
}

export function buildFurnitureExpensesCalculator(
  config: FurnitureCosts
): FurnitureCostsCalculator {
  return {
    ...config,
    generateReports: computeMonthlyCosts(config)
  }
}

function computeMonthlyCosts(
  config: FurnitureCosts
): (period: Period) => MonthlyReport {
  const {
    kitchenCosts,
    bathroomCosts,
    livingRoomCosts,
    bedroomCosts,
    loanStartDate,
    loanDurationInMonths,
    interestRatePercentage
  } = config

  const loanAmount =
    kitchenCosts + bathroomCosts + livingRoomCosts + bedroomCosts

  const rate = computeMonthlyPaymentForFixedInterestRateLoan({
    amount: loanAmount,
    durationInMonths: loanDurationInMonths,
    annualInterestRateInPercent: interestRatePercentage
  })

  const startPeriod = dateToPeriod(loanStartDate)
  const endPeriod = addMonthsToPeriod(startPeriod, loanDurationInMonths)

  return (period: Period): MonthlyReport => {
    const isLoanOngoing = isPeriodBetweenStartAndEnd(
      period,
      startPeriod,
      endPeriod,
      {
        includeStart: true,
        includeEnd: false
      }
    )

    const totalExpenses = isLoanOngoing ? rate : 0

    return {
      period,
      component: FURNITURE_COMPONENT,
      totalIncome: 0,
      totalExpenses,
      detailedExpenses: {
        ...(totalExpenses > 0 && {
          kitchen: (kitchenCosts / loanAmount) * totalExpenses,
          bathroom: (bathroomCosts / loanAmount) * totalExpenses,
          livingRoom: (livingRoomCosts / loanAmount) * totalExpenses,
          bedroom: (bedroomCosts / loanAmount) * totalExpenses
        })
      }
    }
  }
}

const FURNITURE_COMPONENT = "Furniture"
