export interface HouseState {
  totalHouseCost: number;
  ltvPercentage: number;
  interestRate: number;
  duration: number;
  startPaymentDateIsoString: string
  furniture: {
    kitchenCosts: number;
    bathroomCosts: number;
    livingRoomCosts: number;
    bedroomCosts: number;
    loanStartDateIsoString: string;
    loanDurationInMonths: number;
  }
  agencyCosts: AgencyCosts;
}

export type AgencyCosts = (FixedAgencyCosts | VariableAgencyCosts) & {
  beforeTax: boolean
}

interface FixedAgencyCosts {
  type: "fixed"
  parcel: number
}

interface VariableAgencyCosts {
  type: "variable"
  percentage: number
}
