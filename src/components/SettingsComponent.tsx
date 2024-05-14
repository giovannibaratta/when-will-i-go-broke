import {Container, TextField} from "@mui/material"
import {useEffect, useState} from "react"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {settingsActions} from "../state/settings/settings-reducer.ts"


interface SettingsComponentProps {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SettingsComponent: React.FC<SettingsComponentProps> = (_) => {
  const settingsState = useAppSelector(state => state.settings)
  const [simulationLengthInYears, setSimulationLengthInYears] = useState(settingsState.yearsOfSimulation)
  const [simulationResolutionInMonths, setSimulationResolutionInMonth] = useState(settingsState.resolutionInMonths)

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

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(settingsActions.setYearsOfSimulation(simulationLengthInYears))
  }, [dispatch, simulationLengthInYears])

  useEffect(() => {
    dispatch(settingsActions.setResolutionInMonths(simulationResolutionInMonths))
  }, [dispatch, simulationResolutionInMonths])


  return (
    <Container>
      <TextField label={"Number of years"} defaultValue={simulationLengthInYears} type={"number"}
                 onChange={simulationLengthOnChange} />
      <TextField label={"Resolution (months)"} defaultValue={simulationResolutionInMonths} type={"number"}
                 onChange={simulationResolutionOnChange} />
    </Container>
  )
}
