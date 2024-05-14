import {Container, Typography} from "@mui/material"
import React, {useEffect, useState} from "react"
import {CurrencyInputField} from "./shared/CurrencyInputField.tsx"
import {NumericInputField} from "./shared/NumericInputField.tsx"
import {PercentageInputField} from "./shared/PercentageInputField.tsx"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {houseActions} from "../state/house/house-reducer.ts"
import {getFirstDayOfNextMonthsFrom} from "../utils/date.ts"
import dayjs, {Dayjs} from "dayjs"
import {DatePicker} from "@mui/x-date-pickers"

interface HouseComponentProps {
}

const TOTAL_HOUSE_COST_STEP_INCREMENT = 10000
const LTV_PERCENTAGE_STEP_INCREMENT = 5
const INTEREST_RATE_STEP_INCREMENT = 0.1


export const HouseComponent: React.FC<HouseComponentProps> = () => {

  const state = useAppSelector(state => state.house)
  const datePickerMinDate = getFirstDayOfNextMonthsFrom(new Date(), 1)

  const [totalHouseCost, setTotalHouseCost] = useState(state.totalHouseCost)
  const [ltvPercentage, setLtvPercentage] = useState(state.ltvPercentage)
  const [interestRate, setInterestRate] = useState(state.interestRate)
  const [duration, setDuration] = useState(state.duration)
  const [startPayingFrom, setStartPayingFrom] = useState<Date>(new Date(state.startPaymentDateIsoString))

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

  return (
    <Container>
      <Typography variant="h4" sx={{marginBottom: "10px"}}>House costs</Typography>
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
  )
}
