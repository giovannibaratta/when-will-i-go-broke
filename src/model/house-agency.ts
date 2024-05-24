// Interface to represent house costs
import {MonthlyReport, Period} from "./monthly-report.ts"
import {dateToPeriod, isSamePeriod} from "../utils/date.ts"

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

export type HouseAgencyCostsCalculator = HouseAgencyCosts & {
  generateReports: (period: Period) => MonthlyReport
}

export function buildHouseAgencyExpensesCalculator(
  config: HouseAgencyCosts
): HouseAgencyCostsCalculator {
  return {
    ...config,
    generateReports: computeMonthlyCosts(config)
  }
}

const HOUSE_COMPONENT = "House"

function computeMonthlyCosts(
  agencyCosts: HouseAgencyCosts
): (period: Period) => MonthlyReport {
  const houseTransactionPeriod = dateToPeriod(agencyCosts.houseTransactionDate)

  return (period: Period) => {
    const costs = isSamePeriod(period, houseTransactionPeriod)
      ? computeAgencyCosts(agencyCosts)
      : 0

    return {
      period,
      totalExpenses: costs,
      component: HOUSE_COMPONENT,
      totalIncome: 0,
      detailedExpenses: {
        ...(costs > 0 ? {costs} : {})
      }
    }
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
