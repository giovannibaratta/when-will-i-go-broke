import {Month, MonthlyReport, Period} from "./monthly-report.ts"

const CANONE_RAI_MONTH = Month.January
const TARI_MONTHS = [Month.April, Month.August, Month.November]

const MISCELLANEOUS_COMPONENT = "Miscellaneous"

interface MiscellaneousCosts {
  canoneRai: number
  tari: number
}

export type MiscellaneousCostsCalculator = MiscellaneousCosts & {
  generateReports: (period: Period) => MonthlyReport
}

export function buildMiscellaneousExpensesCalculator(
  config: MiscellaneousCosts
): MiscellaneousCostsCalculator {
  return {
    ...config,
    generateReports: computeMonthlyCosts(config)
  }
}

function computeMonthlyCosts(
  config: MiscellaneousCosts
): (period: Period) => MonthlyReport {
  const {canoneRai, tari} = config
  const tariSplitPayment = tari / TARI_MONTHS.length

  return (period: Period): MonthlyReport => {
    const isRaiPeriod = period.month === CANONE_RAI_MONTH
    const isTariPeriod = TARI_MONTHS.includes(period.month)

    const raiCosts = isRaiPeriod ? canoneRai : 0
    const tariCosts = isTariPeriod ? tariSplitPayment : 0

    const totalExpenses = raiCosts + tariCosts

    return {
      period,
      component: MISCELLANEOUS_COMPONENT,
      totalIncome: 0,
      totalExpenses,
      detailedExpenses: {
        ...(raiCosts > 0 && {rai: raiCosts}),
        ...(tariCosts > 0 && {tari: tariCosts})
      }
    }
  }
}
