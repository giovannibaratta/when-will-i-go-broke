import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {MiscellaneousCostsState} from "./miscellaneous-state.ts"

export const CANONE_RAI_DEFAULT_VALUE = 90
export const TARI_DEFAULT_VALUE = 320

const initialState: MiscellaneousCostsState = {
  canoneRai: CANONE_RAI_DEFAULT_VALUE,
  tari: TARI_DEFAULT_VALUE
}

const miscellaneousCostsSlice = createSlice({
  name: "miscellaneousCosts",
  initialState,
  reducers: {
    setCanoneRai: (state, action: PayloadAction<number>) => {
      state.canoneRai = action.payload
    },
    setTari: (state, action: PayloadAction<number>) => {
      state.tari = action.payload
    }
  }
})

export const miscellaneuosActions = miscellaneousCostsSlice.actions
export default miscellaneousCostsSlice.reducer
