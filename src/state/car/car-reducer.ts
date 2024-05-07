import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {CarState} from "./car-state.ts"

const initialState: CarState = {
  duration: 0,
  monthlyRate: 0,
  startPaymentDateIsoString: new Date().toISOString(),
  upfrontPayment: 0
}

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setMonthlyRateAction: (state, action : PayloadAction<number>) => {
      state.monthlyRate = action.payload
    },
    setStartPaymentDateAction: (state, action : PayloadAction<string>) => {
      state.startPaymentDateIsoString = action.payload
    },
    setUpfrontAction: (state, action : PayloadAction<number>) => {
      state.upfrontPayment = action.payload
    }
  }
})

export const {setDuration, setUpfrontAction, setStartPaymentDateAction, setMonthlyRateAction} = carSlice.actions
export default carSlice.reducer
