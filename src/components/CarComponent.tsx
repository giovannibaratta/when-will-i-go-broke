import {Paper, styled} from "@mui/material"
import {CurrencyInputField} from "./shared/CurrencyInputField.tsx"
import React, {useEffect, useState} from "react"
import {Either} from "fp-ts/Either"
import {either} from "fp-ts"
import {NumericInputField} from "./shared/NumericInputField.tsx"
import {
  setDuration as setDurationAction,
  setMonthlyRateAction,
  setStartPaymentDateAction,
  setUpfrontAction
} from "../state/car/car-reducer.ts"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {DatePicker} from "@mui/x-date-pickers"
import dayjs, {Dayjs} from "dayjs"
import {getFirstDayOfNextMonthsFrom} from "../utils/date.ts"

interface CarProps {
  disabled: boolean
}

export const CarComponent: React.FC<CarProps> = (props: CarProps) => {

  const state = useAppSelector(state => state.car)
  const datePickerMinDate = getFirstDayOfNextMonthsFrom(new Date(), 1)

  const dispatch = useAppDispatch()
  const [duration, setDuration] = useState<number>(state.duration)
  const [monthlyRate, setMonthlyRate] = useState<number>(state.monthlyRate)
  const [upfront, setUpfront] = useState<number>(state.upfrontPayment)
  const [startPayingFrom, setStartPayingFrom] = useState<Date>(datePickerMinDate)

  const onDurationChange = (value: number) => {
    setDuration(value)
  }

  const onMonthlyRateChange = (value: number) => {
    setMonthlyRate(value)
  }

  const onUpfrontChange = (value: number) => {
    setUpfront(value)
  }

  const onStartPaymentFromChange = (value: Dayjs | null) => {
    if (value !== null)
      setStartPayingFrom(value.toDate())
  }

  useEffect(() => {
    dispatch(setDurationAction(duration))
  }, [dispatch, duration])

  useEffect(() => {
    dispatch(setMonthlyRateAction(monthlyRate))
  }, [dispatch, monthlyRate])

  useEffect(() => {
    dispatch(setUpfrontAction(upfront))
  }, [dispatch, upfront])

  useEffect(() => {
    dispatch(setStartPaymentDateAction(startPayingFrom.toDateString()))
  }, [dispatch, startPayingFrom])

  return (
    <Paper elevation={1}>
      <Title>Car</Title>
      <CurrencyInputField label={"Monthly Payment"} onValueChange={onMonthlyRateChange}
                          validate={validateGreaterOrEqualToZero} defaultValue={monthlyRate}
                          disabled={props.disabled} />
      <CurrencyInputField label={"Upfront Payment"} onValueChange={onUpfrontChange}
                          validate={validateGreaterOrEqualToZero} defaultValue={upfront} disabled={props.disabled} />
      <DatePicker defaultValue={dayjs(datePickerMinDate)} label="Start payment from" views={["month", "year"]}
                  minDate={dayjs(datePickerMinDate)} onChange={onStartPaymentFromChange} disabled={props.disabled} />
      <NumericInputField label={"Duration"} validate={validateGreaterOrEqualToZero} defaultValue={duration}
                         onValueChange={onDurationChange} disabled={props.disabled} />
    </Paper>
  )
}

const validateGreaterOrEqualToZero = (value: number): Either<string, true> => value >= 0 ? either.right(true) : either.left("Value must be greater or equal to 0")

const Title = styled("div")(() => ({
  padding: "10px",
  fontWeight: "bold",
  textAlign: "left"
}))
