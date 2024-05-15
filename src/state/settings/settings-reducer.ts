import {SettingsState} from "./settings-state.ts"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const SIMULATION_LENGTH_IN_YEARS = 5
const SIMULATION_RESOLUTION_IN_MONTHS = 1
const DEFAULT_INTEREST_RATE_IN_PERCENT = 5

const initialState: SettingsState = {
  yearsOfSimulation: SIMULATION_LENGTH_IN_YEARS,
  resolutionInMonths: SIMULATION_RESOLUTION_IN_MONTHS,
  defaultInterestRateInPercent: DEFAULT_INTEREST_RATE_IN_PERCENT
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setYearsOfSimulation: (state, action: PayloadAction<number>) => {
      state.yearsOfSimulation = action.payload
    },
    setResolutionInMonths: (state, action: PayloadAction<number>) => {
      state.resolutionInMonths = action.payload
    },
    setDefaultInterestRateInPercent: (state, action: PayloadAction<number>) => {
      state.defaultInterestRateInPercent = action.payload
    }
  }
})

export const settingsActions = settingsSlice.actions
export default settingsSlice.reducer
