import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {CarState} from "./car-state.ts"

const DURATION_DEFAULT_VALUE = 24
const MONTHLY_RATE_DEFAULT_VALUE = 400
const UPFRONT_DEFAULT_VALUE = 5000
export const INSURANCE_COST_DEFAULT_VALUE = 600

const initialState: CarState = {
  duration: DURATION_DEFAULT_VALUE,
  monthlyRate: MONTHLY_RATE_DEFAULT_VALUE,
  startPaymentDateIsoString: new Date().toISOString(),
  upfrontPayment: UPFRONT_DEFAULT_VALUE,
  insuranceCost: INSURANCE_COST_DEFAULT_VALUE
}

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setMonthlyRateAction: (state, action: PayloadAction<number>) => {
      state.monthlyRate = action.payload
    },
    setStartPaymentDateAction: (state, action: PayloadAction<string>) => {
      state.startPaymentDateIsoString = action.payload
    },
    setUpfrontAction: (state, action: PayloadAction<number>) => {
      state.upfrontPayment = action.payload
    },
    setInsuranceCost: (state, action: PayloadAction<number>) => {
      state.insuranceCost = action.payload
    }
  }
})

export const {setDuration, setUpfrontAction, setStartPaymentDateAction, setMonthlyRateAction, setInsuranceCost} = carSlice.actions
export default carSlice.reducer
