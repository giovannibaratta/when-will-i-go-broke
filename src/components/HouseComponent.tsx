import {
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography
} from "@mui/material"
import React, {ChangeEvent, useEffect, useState} from "react"
import {CurrencyInputField} from "./shared/CurrencyInputField.tsx"
import {NumericInputField} from "./shared/NumericInputField.tsx"
import {PercentageInputField} from "./shared/PercentageInputField.tsx"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {houseActions} from "../state/house/house-reducer.ts"
import {getFirstDayOfNextMonthsFrom} from "../utils/date.ts"
import dayjs, {Dayjs} from "dayjs"
import {DatePicker} from "@mui/x-date-pickers"
import {AgencyCosts} from "../state/house/house-state.ts"
import {either} from "fp-ts"
import {Either, isRight} from "fp-ts/Either"

interface HouseComponentProps {
}

const TOTAL_HOUSE_COST_STEP_INCREMENT = 10000
const LTV_PERCENTAGE_STEP_INCREMENT = 5
const INTEREST_RATE_STEP_INCREMENT = 0.1
const FURNITURE_COST_STEP_INCREMENT = 200
const AGENCY_COST_STEP_INCREMENT = 1000

export const HouseComponent: React.FC<HouseComponentProps> = () => {

  const state = useAppSelector(state => state.house)
  const datePickerMinDate = getFirstDayOfNextMonthsFrom(new Date(), 1)

  const [totalHouseCost, setTotalHouseCost] = useState(state.totalHouseCost)
  const [ltvPercentage, setLtvPercentage] = useState(state.ltvPercentage)
  const [interestRate, setInterestRate] = useState(state.interestRate)
  const [duration, setDuration] = useState(state.duration)
  const [startPayingFrom, setStartPayingFrom] = useState<Date>(new Date(state.startPaymentDateIsoString))
  const [kitchenCosts, setKitchenCosts] = useState(state.furniture.kitchenCosts)
  const [bathroomCosts, setBathroomCosts] = useState(state.furniture.bathroomCosts)
  const [livingRoomCosts, setLivingRoomCosts] = useState(state.furniture.livingRoomCosts)
  const [bedroomCosts, setBedroomCosts] = useState(state.furniture.bedroomCosts)
  const [loanStartDate, setloanStartDate] = useState<Date>(new Date(state.furniture.loanStartDateIsoString))
  const [furnitureLoanDurationInMonths, setFurnitureLoanDurationInMonths] = useState(state.furniture.loanDurationInMonths)

  const [agencyCostType, setAgencyCostType] = useState<AgencyCosts["type"]>(state.agencyCosts.type)
  const [variableAgencyCostPercentage, setVariableAgencyCostPercentage] = useState(state.agencyCosts.type === "variable" ? state.agencyCosts.percentage : null)
  const [fixedAgencyCost, setFixedAgencyCost] = useState(state.agencyCosts.type === "fixed" ? state.agencyCosts.parcel : null)
  const [agencyCostsIncludeTax, setAgencyCostsIncludeTax] = useState(!state.agencyCosts.beforeTax)

  const handleTotalHouseCostChange = (value: number) => {
    setTotalHouseCost(value)
  }

  const handleLtvPercentageChange = (value: number) => {
    setLtvPercentage(value)
  }

  const handleInterestRateChange = (value: number) => {
    setInterestRate(value)
  }

  const handleDurationChange = (value: number) => {
    setDuration(value)
  }

  const onStartPaymentFromChange = (value: Dayjs | null) => {
    if (value !== null)
      setStartPayingFrom(value.toDate())
  }

  const handleKitchenCostChange = (value: number) => {
    setKitchenCosts(value)
  }

  const handleBathroomCostChange = (value: number) => {
    setBathroomCosts(value)
  }

  const handleLivingRoomCostChange = (value: number) => {
    setLivingRoomCosts(value)
  }

  const handleBedroomCostChange = (value: number) => {
    setBedroomCosts(value)
  }

  const handleLoanStartDateChange = (value: Dayjs | null) => {
    if (value !== null)
      setloanStartDate(value.toDate())
  }

  const handleFurnitureLoanDurationChange = (value: number) => {
    setFurnitureLoanDurationInMonths(value)
  }

  const handleAgencyCostTypeChange = (event: SelectChangeEvent<AgencyCosts["type"]>) => {
    const mappedValue = mapStringToActionCostType(event.target.value)

    if (isRight(mappedValue)) {
      setAgencyCostType(mappedValue.right)
    }
  }

  const handleVariableAgencyCostPercentageChange = (value: number) => {
    setVariableAgencyCostPercentage(value)
  }

  const handleFixedAgencyCostChange = (value: number) => {
    setFixedAgencyCost(value)
  }

  const handleAgencyCostsIncludeTaxChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setAgencyCostsIncludeTax(checked)
  }

  const dispatch = useAppDispatch()

  useEffect(
    () => {
      dispatch(houseActions.setTotalHouseCost(totalHouseCost))
    }, [dispatch, totalHouseCost]
  )

  useEffect(() => {
    dispatch(houseActions.setLtvPercentage(ltvPercentage))
  }, [dispatch, ltvPercentage])

  useEffect(() => {
    dispatch(houseActions.setInterestRate(interestRate))
  }, [dispatch, interestRate])

  useEffect(() => {
    dispatch(houseActions.setDuration(duration))
  }, [dispatch, duration])

  useEffect(() => {
    dispatch(houseActions.setStartPaymentDateAction(startPayingFrom.toDateString()))
  }, [dispatch, startPayingFrom])

  useEffect(() => {
    dispatch(houseActions.setKitchenCosts(kitchenCosts))
  }, [dispatch, kitchenCosts])

  useEffect(() => {
    dispatch(houseActions.setBathroomCosts(bathroomCosts))
  }, [dispatch, bathroomCosts])

  useEffect(() => {
    dispatch(houseActions.setLivingRoomCosts(livingRoomCosts))
  }, [dispatch, livingRoomCosts])

  useEffect(() => {
    dispatch(houseActions.setBedroomCosts(bedroomCosts))
  }, [dispatch, bedroomCosts])

  useEffect(() => {
    dispatch(houseActions.setLoanStartDate(loanStartDate.toDateString()))
  }, [dispatch, loanStartDate])

  useEffect(() => {
    dispatch(houseActions.setFurnitureLoanDurationInMonths(furnitureLoanDurationInMonths))
  }, [dispatch, furnitureLoanDurationInMonths])


  useEffect(() => {

    let agencyCosts: AgencyCosts | null = null
    const beforeTax = !agencyCostsIncludeTax

    if (agencyCostType === "variable") {
      if (variableAgencyCostPercentage) {
        agencyCosts = {
          type: "variable",
          percentage: variableAgencyCostPercentage,
          beforeTax
        }
      }
    } else {
      if (fixedAgencyCost) {
        agencyCosts = {
          type: "fixed",
          parcel: fixedAgencyCost,
          beforeTax
        }
      }
    }

    if (agencyCosts) {
      dispatch(houseActions.setAgencyCosts(agencyCosts))
    }

  }, [dispatch, agencyCostType, variableAgencyCostPercentage, fixedAgencyCost, agencyCostsIncludeTax])

  return (
    <Stack sx={{width: "100%"}} spacing={4} alignItems="flex-start">
      <Paper sx={{width: "100%"}}>
        <Container sx={{m: "10px"}}>
          <Typography variant="h4" sx={{marginBottom: "20px"}}>House costs</Typography>
          <CurrencyInputField
            label="Total House Cost"
            value={totalHouseCost}
            onValueChange={handleTotalHouseCostChange}
            inputProps={{step: TOTAL_HOUSE_COST_STEP_INCREMENT}}
          />
          <PercentageInputField
            label="LTV Percentage"
            value={ltvPercentage}
            onValueChange={handleLtvPercentageChange}
            step={LTV_PERCENTAGE_STEP_INCREMENT}
          />
          <PercentageInputField
            label="Interest Rate"
            value={interestRate}
            onValueChange={handleInterestRateChange}
            step={INTEREST_RATE_STEP_INCREMENT}
          />
          <NumericInputField
            label="Duration (Years)"
            value={duration}
            onValueChange={handleDurationChange}
          />
          <DatePicker defaultValue={dayjs(startPayingFrom)} label="Start payment from" views={["month", "year"]}
                      minDate={dayjs(datePickerMinDate)} onChange={onStartPaymentFromChange} />
        </Container>
      </Paper>
      <Paper sx={{width: "100%"}}>
        <Container sx={{m: "10px"}}>
          <Typography variant="h4" sx={{marginBottom: "20px"}}>Furniture</Typography>
          <CurrencyInputField
            label="Kitchen"
            value={kitchenCosts}
            onValueChange={handleKitchenCostChange}
            inputProps={{step: FURNITURE_COST_STEP_INCREMENT}}
          />

          <CurrencyInputField
            label="Bathroom"
            value={bathroomCosts}
            onValueChange={handleBathroomCostChange}
            inputProps={{step: FURNITURE_COST_STEP_INCREMENT}}
          />
          <CurrencyInputField
            label="Living Room"
            value={livingRoomCosts}
            onValueChange={handleLivingRoomCostChange}
            inputProps={{step: FURNITURE_COST_STEP_INCREMENT}}
          />
          <CurrencyInputField
            label="Bedroom"
            value={bedroomCosts}
            onValueChange={handleBedroomCostChange}
            inputProps={{step: FURNITURE_COST_STEP_INCREMENT}}
          />
          <DatePicker defaultValue={dayjs(loanStartDate)} label="loan start date" views={["month", "year"]}
                      minDate={dayjs(datePickerMinDate)} onChange={handleLoanStartDateChange} />
          <NumericInputField
            label="Duration (Months)"
            value={furnitureLoanDurationInMonths}
            onValueChange={handleFurnitureLoanDurationChange}
          />
        </Container>
      </Paper>
      <Paper sx={{width: "100%"}}>
        <Container sx={{m: "10px"}}>
          <Typography variant="h4" sx={{marginBottom: "20px"}}>Agency Costs</Typography>
          <FormControl>
            <InputLabel id="agency-cost-type-label">Agency Cost Type</InputLabel>
            <Select
              labelId="agency-cost-type-label"
              id="agency-cost-type"
              value={agencyCostType}
              label="Agency Cost Type"
              onChange={handleAgencyCostTypeChange}
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="variable">Variable</MenuItem>
            </Select>
          </FormControl>
          {agencyCostType === "variable" && (
            <PercentageInputField
              label="Variable parcel"
              value={variableAgencyCostPercentage ?? ""}
              onValueChange={handleVariableAgencyCostPercentageChange}
            />
          )}
          {agencyCostType === "fixed" && (
            <CurrencyInputField
              label="Agency Costs"
              value={fixedAgencyCost ?? ""}
              onValueChange={handleFixedAgencyCostChange}
              inputProps={{step: AGENCY_COST_STEP_INCREMENT}}
            />
          )}
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={agencyCostsIncludeTax} onChange={handleAgencyCostsIncludeTaxChange}
                               value={agencyCostsIncludeTax} />}
              label="Include taxes (VAT, ...)" />
          </FormGroup>
        </Container>
      </Paper>
    </Stack>
  )
}

function mapStringToActionCostType(value: string): Either<"unknown", AgencyCosts["type"]> {
  switch (value) {
    case "fixed":
      return either.right(value)
    case "variable":
      return either.right(value)
    default:
      return either.left("unknown")
  }
}
