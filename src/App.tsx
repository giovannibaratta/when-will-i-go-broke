import "./App.css"
import {CarComponent} from "./components/CarComponent.tsx"
import {CostsProjectionComponent, Report} from "./components/CostsProjectionComponent.tsx"
import {Button, TextField} from "@mui/material"
import React, {useState} from "react"
import {useAppSelector} from "./state/store.ts"
import {getFirstDayOfNextMonthsFrom} from "./utils/date.ts"
import {buildCarExpensesCalculator} from "./model/car.ts"

const SIMULATION_LENGTH_IN_YEARS = 10
const SIMULATION_RESOLUTION_IN_MONTHS = 1
const ONE_YEAR_IN_MS = 1 * 1000 * 60 * 60 * 24 * 365

function App() {
  const [simulationLengthInYears, setSimulationLengthInYears] = useState(SIMULATION_LENGTH_IN_YEARS)
  const [simulationResolutionInMonths, setSimulationResolutionInMonth] = useState(SIMULATION_RESOLUTION_IN_MONTHS)
  const carState = useAppSelector(state => state.car)

  const refreshCostProjection = () => {
    console.log(carState)
  }

  const simulationLengthOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const parsedValue = parseFloat(value)
    setSimulationLengthInYears(parsedValue)
  }

  const simulationResolutionOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const parsedValue = parseFloat(value)
    setSimulationResolutionInMonth(parsedValue)
  }

  const records: Report[] = []

  const now = new Date(Date.now())
  const simulationStartDate = getFirstDayOfNextMonthsFrom(now, 1)
  let simulationCurrentDate = simulationStartDate
  const simulationEndingDate = new Date(simulationStartDate.getTime() + (ONE_YEAR_IN_MS * simulationLengthInYears))

  const carExpensesCalculator = buildCarExpensesCalculator({
    type: "CarMonthlyRateAndUpfront",
    monthlyRate: carState.monthlyRate,
    duration: carState.duration,
    startDate: new Date(carState.startPaymentDateIsoString),
    upfront: carState.upfrontPayment
  })

  while (simulationCurrentDate.getTime() < simulationEndingDate.getTime()) {

    const carReport = carExpensesCalculator.computeMonthlyReport({
      month: simulationCurrentDate.getMonth(),
      year: simulationCurrentDate.getFullYear()
    })

    const record: Report = {
      date: simulationCurrentDate,
      income: 0,
      totalMonthExpenses: carReport.totalExpenses
    }

    records.push(record)
    simulationCurrentDate = getFirstDayOfNextMonthsFrom(simulationCurrentDate, simulationResolutionInMonths)
  }

  console.log(records)

  return (
    <>
      <CarComponent disabled={false} />
      <TextField label={"Number of years"} defaultValue={simulationLengthInYears} type={"number"}
                 onChange={simulationLengthOnChange} />
      <TextField label={"Resolution (months)"} defaultValue={simulationResolutionInMonths} type={"number"}
                 onChange={simulationResolutionOnChange} />
      <Button variant="contained"
              onClick={refreshCostProjection}>Refresh
        projection</Button>
      <div>Start date: {simulationStartDate.toDateString()} End date: {simulationEndingDate.toDateString()}</div>
      <CostsProjectionComponent data={records} />
    </>
  )
}

export default App

