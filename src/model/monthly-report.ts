export interface MonthlyReport {
  period: Period
  totalExpenses: number
  detailedExpenses: Record<string, number>
}

export interface Period {
  month: number
  year: number
}
