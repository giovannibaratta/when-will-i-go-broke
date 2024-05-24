import {
  Month,
  Report,
  Period,
  ReportGenerator,
  ReportsGenerator
} from "./monthly-report.ts"

const CANONE_RAI_MONTH = Month.January
const TARI_MONTHS = [Month.April, Month.August, Month.November]

interface MiscellaneousCosts {
  canoneRai: number
  tari: number
}

export type MiscellaneousCostsCalculator = MiscellaneousCosts & ReportGenerator

export function buildMiscellaneousExpensesCalculator(
  config: MiscellaneousCosts
): MiscellaneousCostsCalculator {
  return {
    ...config,
    generateReports: generateReportsBuilder(config)
  }
}

function generateReportsBuilder(config: MiscellaneousCosts): ReportsGenerator {
  const {canoneRai, tari} = config
  const tariSplitPayment = tari / TARI_MONTHS.length

  return (period: Period): ReadonlyArray<Report> => {
    const isRaiPeriod = period.month === CANONE_RAI_MONTH
    const isTariPeriod = TARI_MONTHS.includes(period.month)

    const reports: Report[] = []

    if (isRaiPeriod) {
      reports.push(
        buildReport({
          period,
          component: CANONE_RAI_COMPONENT,
          amount: canoneRai
        })
      )
    }

    if (isTariPeriod) {
      reports.push(
        buildReport({
          period,
          component: TARI_COMPONENT,
          amount: tariSplitPayment
        })
      )
    }

    return reports
  }
}

function buildReport(
  data: Pick<Report, "amount" | "component" | "period">
): Report {
  const {period, component, amount} = data

  return {
    period,
    component,
    amount,
    type: "Expense",
    category: MISCELLANEOUS_CATEGORY
  }
}

export const MISCELLANEOUS_CATEGORY = "Miscellaneous"
export const CANONE_RAI_COMPONENT = "CanoneRai"
export const TARI_COMPONENT = "Tari"

export type MiscellaneousComponents =
  | typeof CANONE_RAI_COMPONENT
  | typeof TARI_COMPONENT
