import {Container, TextField, Typography} from "@mui/material"
import {useEffect, useState} from "react"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {settingsActions} from "../state/settings/settings-reducer.ts"
import {PercentageInputField} from "./shared/PercentageInputField.tsx"


interface SettingsComponentProps {
}

const DEFAULT_INTEREST_RATE_STEP = 1

export const SettingsComponent: React.FC<SettingsComponentProps> = () => {
  const settingsState = useAppSelector(state => state.settings)
  const [simulationLengthInYears, setSimulationLengthInYears] = useState(settingsState.yearsOfSimulation)
  const [simulationResolutionInMonths, setSimulationResolutionInMonth] = useState(settingsState.resolutionInMonths)
  const [defaultInterestRate, setDefaultInterestRate] = useState(settingsState.defaultInterestRateInPercent)
  const [vatPercentage, setVatPercentage] = useState(settingsState.vatInPercent)

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

  const defaultInterestRateOnChange = (value: number) => {
    setDefaultInterestRate(value)
  }

  const vatPercentageOnChange = (value: number) => {
    setVatPercentage(value)
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(settingsActions.setYearsOfSimulation(simulationLengthInYears))
  }, [dispatch, simulationLengthInYears])

  useEffect(() => {
    dispatch(settingsActions.setResolutionInMonths(simulationResolutionInMonths))
  }, [dispatch, simulationResolutionInMonths])

  useEffect(() => {
    dispatch(settingsActions.setDefaultInterestRateInPercent(defaultInterestRate))
  }, [dispatch, defaultInterestRate])

  useEffect(() => {
    dispatch(settingsActions.setVatInPercent(vatPercentage))
  }, [dispatch, vatPercentage])

  return (
    <Container style={{justifyContent: "left"}}>
      <Container>
        <Typography variant={"h4"} sx={{margin: "20px"}}>Simulation</Typography>

        <TextField label={"Number of years"} defaultValue={simulationLengthInYears} type={"number"}
                   onChange={simulationLengthOnChange} />
        <TextField label={"Resolution (months)"} defaultValue={simulationResolutionInMonths} type={"number"}
                   onChange={simulationResolutionOnChange} />
        <PercentageInputField label={"VAT"} onValueChange={vatPercentageOnChange}
                              defaultValue={vatPercentage}
                              step={DEFAULT_INTEREST_RATE_STEP} />
      </Container>
      <Container>
        <Typography variant={"h4"} sx={{margin: "20px"}}>Loans</Typography>
        <PercentageInputField label={"Default interest rate"} onValueChange={defaultInterestRateOnChange}
                              defaultValue={settingsState.defaultInterestRateInPercent}
                              step={DEFAULT_INTEREST_RATE_STEP} />
      </Container>
    </Container>
  )
}
