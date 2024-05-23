import {Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme} from "@mui/material"
import React from "react"
import {formatNumberToEuro} from "../utils/print.ts"
import {green, orange, red} from "@mui/material/colors"

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

export interface Report {
  readonly date: Date
  readonly income: number
  readonly totalMonthExpenses: number
}

const generateRows = (data: ReadonlyArray<Report>) => {
  let balance = 0

  return data.map(it => {

    balance += it.income - it.totalMonthExpenses

    return {
      balance,
      date: it.date,
      income: it.income,
      totalMonthExpenses: it.totalMonthExpenses,
      delta: it.income - it.totalMonthExpenses
    }
  })
}

export const CostsProjectionComponent: React.FC<CostProjectionComponentProps> = (props: CostProjectionComponentProps) => {

  const rows = generateRows(props.data)

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
