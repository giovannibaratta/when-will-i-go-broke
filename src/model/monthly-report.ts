import {CAR_CATEGORY, CarComponents} from "./car"
import {FURNITURE_CATEGORY, FurnitureComponents} from "./furniture"
import {HOUSE_CATEGORY, HouseComponents} from "./house"
import {HouseAgencyComponents} from "./house-agency"
import {INCOME_CATEGORY, IncomeComponents} from "./income"
import {MISCELLANEOUS_CATEGORY, MiscellaneousComponents} from "./miscellaneous"

export type Report = BaseReport & (IncomeReport | ExpenseReport)

interface BaseReport {
  readonly period: Period
  readonly category: Category
  readonly component: Component
}

export type Category =
  | typeof CAR_CATEGORY
  | typeof FURNITURE_CATEGORY
  | typeof HOUSE_CATEGORY
  | typeof INCOME_CATEGORY
  | typeof MISCELLANEOUS_CATEGORY

export type Component =
  | CarComponents
  | FurnitureComponents
  | HouseComponents
  | HouseAgencyComponents
  | IncomeComponents
  | MiscellaneousComponents

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

export type ReportsGenerator = (period: Period) => ReadonlyArray<Report>

export interface ReportGenerator {
  generateReports: ReportsGenerator
}
