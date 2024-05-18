import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AgencyCosts, HouseState} from "./house-state"
import {getFirstDayOfNextMonthsFrom} from "../../utils/date.ts"

const TOTAL_HOUSE_COST_INITIAL_VALUE = 200000
const LTV_PERCENTAGE_INITIAL_VALUE = 80
const INTEREST_RATE_INITIAL_VALUE = 3
const DURATION_INITIAL_VALUE = 20
const FURNITURE_LOAN_DURATION_INITIAL_VALUE = 24
const AGENCY_COSTS_VARIABLE_PERCENTAGE_INITIAL_VALUE = 3

const initialState: HouseState = {
  totalHouseCost: TOTAL_HOUSE_COST_INITIAL_VALUE,
  ltvPercentage: LTV_PERCENTAGE_INITIAL_VALUE,
  interestRate: INTEREST_RATE_INITIAL_VALUE,
  duration: DURATION_INITIAL_VALUE,
  startPaymentDateIsoString: getFirstDayOfNextMonthsFrom(new Date(), 1).toDateString(),
  furniture: {
    kitchenCosts: 0,
    livingRoomCosts: 0,
    bathroomCosts: 0,
    bedroomCosts: 0,
    loanStartDateIsoString: getFirstDayOfNextMonthsFrom(new Date(), 1).toDateString(),
    loanDurationInMonths: FURNITURE_LOAN_DURATION_INITIAL_VALUE
  },
  agencyCosts: {
    type: "variable",
    beforeTax: true,
    percentage: AGENCY_COSTS_VARIABLE_PERCENTAGE_INITIAL_VALUE
  }
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
    },
    setKitchenCosts: (state, action: PayloadAction<number>) => {
      state.furniture.kitchenCosts = action.payload
    },
    setLivingRoomCosts: (state, action: PayloadAction<number>) => {
      state.furniture.livingRoomCosts = action.payload
    },
    setBathroomCosts: (state, action: PayloadAction<number>) => {
      state.furniture.bathroomCosts = action.payload
    },
    setBedroomCosts: (state, action: PayloadAction<number>) => {
      state.furniture.bedroomCosts = action.payload
    },
    setLoanStartDate: (state, action: PayloadAction<string>) => {
      state.furniture.loanStartDateIsoString = action.payload
    },
    setFurnitureLoanDurationInMonths: (state, action: PayloadAction<number>) => {
      state.furniture.loanDurationInMonths = action.payload
    },
    setAgencyCosts: (state, action: PayloadAction<AgencyCosts>) => {
      state.agencyCosts = action.payload
    }
  }
})

export const houseActions = houseSlice.actions
export default houseSlice.reducer
