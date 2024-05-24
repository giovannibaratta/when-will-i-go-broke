import {CAR_CATEGORY, CarComponents} from "./car"

export type Report = BaseReport & (IncomeReport | ExpenseReport)

interface BaseReport {
  readonly period: Period
  readonly category: Category
  readonly component: Component
}

export type Category = typeof CAR_CATEGORY // | HouseCategory | MiscellaneuosCategory | SalaryCategory
export type Component = CarComponents //| HouseComponents | MiscellaneuosComponents | SalaryComponents

interface IncomeReport {
  type: "Income"
  amount: number
}

interface ExpenseReport {
  type: "Expense"
  amount: number
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
  December = 11
}

export type PeriodCalculator = (period: Period) => ReadonlyArray<Report>

export interface Calculator {
  generateReports: PeriodCalculator
}
