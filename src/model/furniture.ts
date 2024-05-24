import {
  Report,
  Period,
  ReportsGenerator,
  ReportGenerator
} from "./monthly-report.ts"
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

export type FurnitureCostsCalculator = FurnitureCosts & ReportGenerator

export function buildFurnitureExpensesCalculator(
  config: FurnitureCosts
): FurnitureCostsCalculator {
  return {
    ...config,
    generateReports: computeMonthlyCosts(config)
  }
}

function computeMonthlyCosts(config: FurnitureCosts): ReportsGenerator {
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

  return (period: Period): ReadonlyArray<Report> => {
    const isLoanOngoing = isPeriodBetweenStartAndEnd(
      period,
      startPeriod,
      endPeriod,
      {
        includeStart: true,
        includeEnd: false
      }
    )

    const reports: Report[] = []

    if (isLoanOngoing && loanAmount > 0) {
      const kitchenReport = buildFurnitureReport({
        period,
        amount: (kitchenCosts / loanAmount) * rate,
        component: KITCHEN_COMPONENT
      })

      const bathroomReport = buildFurnitureReport({
        period,
        amount: (bathroomCosts / loanAmount) * rate,
        component: BATHROOM_COMPONENT
      })

      const livingRoomReport = buildFurnitureReport({
        period,
        amount: (livingRoomCosts / loanAmount) * rate,
        component: LIVING_ROOM_COMPONENT
      })

      const bedroomReport = buildFurnitureReport({
        period,
        amount: (bedroomCosts / loanAmount) * rate,
        component: BEDROOM_COMPONENT
      })

      reports.push(
        kitchenReport,
        bedroomReport,
        livingRoomReport,
        bathroomReport
      )
    }

    return reports
  }
}

function buildFurnitureReport(
  data: Pick<Report, "amount" | "component" | "period">
): Report {
  const {amount, component, period} = data

  return {
    category: FURNITURE_CATEGORY,
    type: "Expense",
    amount,
    component,
    period
  }
}

export const FURNITURE_CATEGORY = "Furniture"
export const KITCHEN_COMPONENT = "Kitchen"
export const BATHROOM_COMPONENT = "Bathroom"
export const LIVING_ROOM_COMPONENT = "Living Room"
export const BEDROOM_COMPONENT = "Bedroom"
export type FurnitureComponents =
  | typeof KITCHEN_COMPONENT
  | typeof BATHROOM_COMPONENT
  | typeof LIVING_ROOM_COMPONENT
  | typeof BEDROOM_COMPONENT
