import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IncomeState, YoYGrowth} from "./income-state.ts"

const STARTING_MONEY_DEFAULT_VALUE = 0
const MONTHLY_NET_INCOME_DEFAULT_VALUE = 0
const TREDICESIMA_DEFAULT_VALUE = false
const QUATTORDICESIMA_DEFAULT_VALUE = false


const initialState: IncomeState = {
  quattordicesima: QUATTORDICESIMA_DEFAULT_VALUE,
  tredicesima: TREDICESIMA_DEFAULT_VALUE,
  monthlyIncomeRate: MONTHLY_NET_INCOME_DEFAULT_VALUE,
  startingMoney: STARTING_MONEY_DEFAULT_VALUE,
  yoyGrowth: {type: "GrowthDisable"}
}

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    setMonthlyIncomeRate: (state, action: PayloadAction<number>) => {
      state.monthlyIncomeRate = action.payload
    },
    setStartingMoney: (state, action: PayloadAction<number>) => {
      state.startingMoney = action.payload
    },
    setQuattordicesima: (state, action: PayloadAction<boolean>) => {
      state.quattordicesima = action.payload
    },
    setTredicesima: (state, action: PayloadAction<boolean>) => {
      state.tredicesima = action.payload
    },
    setYoyGrowth: (state, action: PayloadAction<YoYGrowth>) => {
      state.yoyGrowth = action.payload
    }
  }
})

export const {
  setMonthlyIncomeRate,
  setTredicesima,
  setQuattordicesima,
  setYoyGrowth,
  setStartingMoney
} = incomeSlice.actions
export default incomeSlice.reducer
