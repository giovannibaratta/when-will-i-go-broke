import {
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  Slider,
  Tooltip,
  Typography
} from "@mui/material"
import {CurrencyInputField} from "./shared/CurrencyInputField.tsx"
import React, {ChangeEvent, useEffect, useState} from "react"
import {Either} from "fp-ts/Either"
import {either} from "fp-ts"
import {useAppDispatch, useAppSelector} from "../state/store.ts"
import {YoYGrowth} from "../state/income/income-state.ts"
import {
  setMonthlyIncomeRate as setMonthlyIncomeRateAction,
  setQuattordicesima,
  setStartingMoney as setStartingMoneyAction,
  setTredicesima as setTredicesimaAction,
  setYoyGrowth as setYoyGrowthAction
} from "../state/income/income-reducer.ts"
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined"

interface IncomeComponentProps {
}

const YOY_GROWTH_DEFAULT_VALUE = 2
const STARTING_MONEY_STEP_INCREMENT = 5000
const MONTHLY_INCOME_STEP_INCREMENT = 200

const yoyGrowthMarks = [
  {
    value: 1,
    label: "1%"
  },
  {
    value: 2,
    label: "2%"
  },
  {
    value: 5,
    label: "5%"
  },
  {
    value: 10,
    label: "10%"
  }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IncomeComponent: React.FC<IncomeComponentProps> = (_: IncomeComponentProps) => {

  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.income)

  const yoYGrowthPercentageInitialValue = state.yoyGrowth.type !== "GrowthDisable" ? state.yoyGrowth.percentage : YOY_GROWTH_DEFAULT_VALUE

  const [startingMoney, setStartingMoney] = useState<number>(state.startingMoney)
  const [monthlyNetIncome, setMonthlyNetIncome] = useState<number>(state.monthlyIncomeRate)
  const [enableYoYGrowth, setEnableYoYGrowth] = useState<boolean>(state.yoyGrowth.type !== "GrowthDisable")
  const [yoYGrowthPercentage, setYoYGrowthPercentage] = useState<number>(yoYGrowthPercentageInitialValue)
  const [enableTredicesima, setEnableTredicesima] = useState<boolean>(state.tredicesima)
  const [enableQuattordicesima, setEnableQuattordicesima] = useState<boolean>(state.quattordicesima)


  const onYoyCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableYoYGrowth(event.target.checked)
  }

  const onTredicesimaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableTredicesima(event.target.checked)
  }

  const onQuattordicesimaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableQuattordicesima(event.target.checked)
  }

  const onStartingMoneyChange = (value: number) => {
    setStartingMoney(value)
  }

  const onSetMonthlyNetIncome = (value: number) => {
    setMonthlyNetIncome(value)
  }

  const onYoyGrowthMultiplierChange = (_: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      const percentage = newValue
      setYoYGrowthPercentage(percentage)
    }
  }

  useEffect(() => {
    const yoyGrowth: YoYGrowth = enableYoYGrowth ? {
      type: "Percentage",
      percentage: yoYGrowthPercentage
    } : {type: "GrowthDisable"}

    dispatch(setYoyGrowthAction(yoyGrowth))
  }, [dispatch, enableYoYGrowth, yoYGrowthPercentage])


  useEffect(() => {
    dispatch(setTredicesimaAction(enableTredicesima))
  }, [dispatch, enableTredicesima])

  useEffect(() => {
    dispatch(setQuattordicesima(enableQuattordicesima))
  }, [dispatch, enableQuattordicesima])

  useEffect(() => {
    dispatch(setStartingMoneyAction(startingMoney))
  }, [dispatch, startingMoney])

  useEffect(() => {
    dispatch(setMonthlyIncomeRateAction(monthlyNetIncome))
  })

  return (
    <Container>
      <Typography variant={"h4"} sx={{marginBottom: "20px"}}>Income</Typography>
      <CurrencyInputField label={"Starting money"}
                          validate={validateGreaterOrEqualToZero} defaultValue={startingMoney}
                          inputProps={{step: STARTING_MONEY_STEP_INCREMENT}} onValueChange={onStartingMoneyChange}
      />
      <CurrencyInputField label={"Monthly net income"}
                          validate={validateGreaterOrEqualToZero} defaultValue={monthlyNetIncome}
                          inputProps={{step: MONTHLY_INCOME_STEP_INCREMENT}} onValueChange={onSetMonthlyNetIncome} />


      <InputLabel htmlFor={"yoySlider"}>YoY growth</InputLabel>
      <Slider
        id={"yoySlider"}
        aria-label="Restricted values"
        defaultValue={yoYGrowthPercentage}
        getAriaValueText={(value) => `${value}%`}
        step={null}
        valueLabelDisplay="auto"
        marks={yoyGrowthMarks}
        min={yoyGrowthMarks[0].value}
        max={yoyGrowthMarks[yoyGrowthMarks.length - 1].value}
        disabled={!enableYoYGrowth}
        onChange={onYoyGrowthMultiplierChange}
      />

      <FormGroup>
        <Container style={{display: "flex", justifyContent: "flex-start"}}><FormControlLabel
          control={<Checkbox defaultChecked onChange={onYoyCheckboxChange} />} label="YoY Growth" /></Container>
        <Container style={{display: "flex", justifyContent: "flex-start"}}><FormControlLabel
          control={<Checkbox defaultChecked onChange={onTredicesimaChange} />}
          label="Tredicesima" /><Tooltip title="Add an extra payslip in Decemeber">
          <IconButton>
            <HelpOutlineOutlinedIcon fontSize={"small"} />
          </IconButton>
        </Tooltip></Container>
        <Container style={{display: "flex", justifyContent: "flex-start"}}><FormControlLabel
          control={<Checkbox onChange={onQuattordicesimaChange} />} label="Quattordicesima" /><Tooltip
          title="Add an extra payslip in June">
          <IconButton>
            <HelpOutlineOutlinedIcon fontSize={"small"} />
          </IconButton>
        </Tooltip></Container>
      </FormGroup>
    </Container>
  )
}

const validateGreaterOrEqualToZero = (value: number): Either<string, true> => value >= 0 ? either.right(true) : either.left("Value must be greater or equal to 0")
