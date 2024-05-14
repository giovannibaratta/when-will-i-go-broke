import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {HouseState} from "./house-state"
import {getFirstDayOfNextMonthsFrom} from "../../utils/date.ts"

const TOTAL_HOUSE_COST_INITIAL_VALUE = 200000
const LTV_PERCENTAGE_INITIAL_VALUE = 80
const INTEREST_RATE_INITIAL_VALUE = 3
const DURATION_INITIAL_VALUE = 20

const initialState: HouseState = {
  totalHouseCost: TOTAL_HOUSE_COST_INITIAL_VALUE,
  ltvPercentage: LTV_PERCENTAGE_INITIAL_VALUE,
  interestRate: INTEREST_RATE_INITIAL_VALUE,
  duration: DURATION_INITIAL_VALUE,
  startPaymentDateIsoString: getFirstDayOfNextMonthsFrom(new Date(), 1).toDateString()
}

const houseSlice = createSlice({
  name: "house",
  initialState,
  reducers: {
    setTotalHouseCost: (state, action: PayloadAction<number>) => {
      state.totalHouseCost = action.payload
    },
    setLtvPercentage: (state, action: PayloadAction<number>) => {
      state.ltvPercentage = action.payload
    },
    setInterestRate: (state, action: PayloadAction<number>) => {
      state.interestRate = action.payload
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setStartPaymentDateAction: (state, action: PayloadAction<string>) => {
      state.startPaymentDateIsoString = action.payload
    }
  }
})

export const {
  setStartPaymentDateAction,
  setTotalHouseCost,
  setLtvPercentage,
  setInterestRate,
  setDuration
} = houseSlice.actions
export const houseActions = houseSlice.actions
export default houseSlice.reducer
