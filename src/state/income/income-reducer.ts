import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IncomeState, YoYGrowth} from "./income-state.ts"

const initialState: IncomeState = {
  quattordicesima: false,
  tredicesima: false,
  monthlyIncomeRate: 0,
  startingMoney: 0,
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
