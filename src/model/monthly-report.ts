export interface MonthlyReport {
  readonly period: Period
  readonly component: string,
  readonly totalIncome: number,
  readonly totalExpenses: number
  readonly detailedExpenses: Record<string, number>
}

export interface Period {
  month: Month
  year: number
}

export enum Month {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}
