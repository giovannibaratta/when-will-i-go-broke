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
}
