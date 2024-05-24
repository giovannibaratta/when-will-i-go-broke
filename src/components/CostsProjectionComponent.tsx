import { Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material"
import { green, orange, red } from "@mui/material/colors"
import React from "react"
import { Period, Report } from "../model/monthly-report.ts"
import { formatNumberToEuro } from "../utils/print.ts"

const DELTA_MEDIUM_THRESHOLD = 0
const DELTA_CRITICAL_THRESHOLD = -500
const BALANCE_CRITICAL_THRESHOLD = 5000
const BALANCE_MEDIUM_THRESHOLD = 15000
const BALANCE_SAFE_THRESHOLD = Number.MAX_VALUE

const criticalAttentionStyle: SxProps<Theme> = {
  color: red["900"],
  fontWeight: "bolder"
}

const mediumAttentionStyle: SxProps<Theme> = {
  color: orange["700"],
  fontWeight: "bolder"
}

const balanceSafeThresholdStyle: SxProps<Theme> = {
  color: green["700"]
}

const balanceThresholds: [number, SxProps<Theme>][] = [
  [BALANCE_CRITICAL_THRESHOLD, criticalAttentionStyle],
  [BALANCE_MEDIUM_THRESHOLD, mediumAttentionStyle],
  [BALANCE_SAFE_THRESHOLD, balanceSafeThresholdStyle]
]

interface CostProjectionComponentProps {
  data: ReadonlyArray<Report>
}

interface Row {
  balance: number
  date: Date
  income: number
  totalMonthExpenses: number
  delta: number
}

const generateRows = (data: Map<Period, Report[]>) => {
  const rows : Row[] = []

  const periods = Array.from(data.keys())
  periods.sort((a, b) => a.year - b.year || a.month - b.month)

  let balance = 0

  for(const period of periods){
    const reports = data.get(period)

    const totalIncome = reports?.filter(it => it.type === "Income").reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0) ?? 0
    const totalMonthExpenses = reports?.filter(it => it.type === "Expense").reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0) ?? 0
    const delta = totalIncome - totalMonthExpenses

    balance += delta

    if(reports){
      rows.push({
        balance: balance,
        date: new Date(period.year, period.month),
        income: totalIncome,
        totalMonthExpenses: totalMonthExpenses,
        delta
      })

    }
  }

  return rows
}

const prepareDataForRendering = (reports: ReadonlyArray<Report>) => {

  // Build a map where the key in the category and the value is a list of components for the given
  // category. We could extract these lists from the types but in this way we are sure to fill
  // only the ones that have a value.
  const categoryComponentsMap = new Map<string, Set<string>>()
  // Rearrange all the reports for a given period to ease the computation when displaying the data
  const periodReportsMap = new Map<Period, Report[]>()

  for (const report of reports) {
    // Update the component categories map
    const category = report.category
    const components = categoryComponentsMap.get(category) ?? new Set()
    components.add(report.component)
    categoryComponentsMap.set(category, components)

    // Aggregate the periods
    const period = report.period
    const reportsForPeriod = periodReportsMap.get(period) ?? []
    reportsForPeriod.push(report)
    periodReportsMap.set(period, reportsForPeriod)
  }

  return { periodReportsMap, categoryComponentsMap }
}

export const CostsProjectionComponent: React.FC<CostProjectionComponentProps> = (props: CostProjectionComponentProps) => {

  const { data } = props

  const { periodReportsMap } = prepareDataForRendering(data)
  const rows = generateRows(periodReportsMap)

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Income</TableCell>
            <TableCell align="right">Expenses</TableCell>
            <TableCell align="right">Delta</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date.toDateString()}
              sx={{"&:last-child td, &:last-child th": {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {row.date.toDateString()}
              </TableCell>
              <TableCell sx={computeBalanceStyle(row.balance)}
                         align="right">{formatNumberToEuro(row.balance)}</TableCell>
              <TableCell align="right">{formatNumberToEuro(row.income)}</TableCell>
              <TableCell align="right">{formatNumberToEuro(row.totalMonthExpenses)}</TableCell>
              <TableCell sx={computeDeltaStyle(row.delta)} align="right">{formatNumberToEuro(row.delta)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const computeBalanceStyle = (balance: number) => {
  for (const threshold of balanceThresholds) {
    if (balance <= threshold[0]) {
      return threshold[1]
    }
  }
}

const computeDeltaStyle = (delta: number) => {
  if (delta < DELTA_CRITICAL_THRESHOLD) {
    return criticalAttentionStyle
  }

  if (delta < DELTA_MEDIUM_THRESHOLD) {
    return mediumAttentionStyle
  }

  return {}
}
