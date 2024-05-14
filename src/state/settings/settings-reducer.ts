import {SettingsState} from "./settings-state.ts"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const SIMULATION_LENGTH_IN_YEARS = 5
const SIMULATION_RESOLUTION_IN_MONTHS = 1

const initialState: SettingsState = {
  yearsOfSimulation: SIMULATION_LENGTH_IN_YEARS,
  resolutionInMonths: SIMULATION_RESOLUTION_IN_MONTHS
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
    }
  }
})

export const {setYearsOfSimulation, setResolutionInMonths} = settingsSlice.actions
export const settingsActions = settingsSlice.actions
export default settingsSlice.reducer
