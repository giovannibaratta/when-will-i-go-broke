// Interface to represent house costs
import {
  Report,
  Period,
  ReportGenerator,
  ReportsGenerator
} from "./monthly-report.ts"
import {dateToPeriod, isSamePeriod} from "../utils/date.ts"
import {HOUSE_CATEGORY} from "./house.ts"

export type HouseAgencyCosts = (FixedAgencyCosts | VariableAgencyCosts) & {
  tax: Tax
  totalHouseCosts: number
  houseTransactionDate: Date
}

type Tax = BeforeTax | AfterTax

interface BeforeTax {
  type: "beforeTax"
  vatPercentage: number
}

interface AfterTax {
  type: "afterTax"
}

interface FixedAgencyCosts {
  type: "fixed"
  parcel: number
}

interface VariableAgencyCosts {
  type: "variable"
  percentage: number
}

export type HouseAgencyCostsCalculator = HouseAgencyCosts & ReportGenerator

export function buildHouseAgencyExpensesCalculator(
  config: HouseAgencyCosts
): HouseAgencyCostsCalculator {
  return {
    ...config,
    generateReports: computeMonthlyCosts(config)
  }
}

function computeMonthlyCosts(agencyCosts: HouseAgencyCosts): ReportsGenerator {
  const houseTransactionPeriod = dateToPeriod(agencyCosts.houseTransactionDate)

  return (period: Period) => {
    const reports: Report[] = []

    if (isSamePeriod(period, houseTransactionPeriod)) {
      reports.push({
        period,
        category: HOUSE_CATEGORY,
        component: AGENCY_PARCEL_COMPONENT,
        amount: computeAgencyCosts(agencyCosts),
        type: "Expense"
      })
    }

    return reports
  }
}

function computeAgencyCosts(agencyCosts: HouseAgencyCosts): number {
  let amount: number

  switch (agencyCosts.type) {
    case "fixed":
      amount = agencyCosts.parcel
      break
    case "variable":
      amount = (agencyCosts.totalHouseCosts * agencyCosts.percentage) / 100
      break
  }

  if (agencyCosts.tax.type === "beforeTax") {
    amount *= 1 + agencyCosts.tax.vatPercentage / 100
  }

  return amount
}

export const AGENCY_PARCEL_COMPONENT = "Agency parcel"

export type HouseAgencyComponents = typeof AGENCY_PARCEL_COMPONENT
