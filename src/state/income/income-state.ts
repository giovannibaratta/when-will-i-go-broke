export interface IncomeState {
  startingMoney: number
  monthlyIncomeRate: number
  yoyGrowth: YoYGrowth
  tredicesima: boolean
  quattordicesima: boolean
}

export type YoYGrowth = GrowthDisable | Percentage

interface GrowthDisable {
  type: "GrowthDisable"
}

interface Percentage {
  type: "Percentage"
  percentage: number
}

