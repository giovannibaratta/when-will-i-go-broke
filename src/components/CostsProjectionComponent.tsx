import {Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme} from "@mui/material"
import React from "react"
import {formatNumberToEuro} from "../utils/print.ts"
import {green, orange, red} from "@mui/material/colors"
import {MonthlyReport, Period} from "../model/monthly-report.ts"
import {isSamePeriod} from "../utils/date.ts"

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
  data: ReadonlyArray<MonthlyReport>
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

const prepareDataForRendering = (data: ReadonlyArray<MonthlyReport>) => {

  const uniqueDetailedExpenses = new Map<string, Set<string>>()
  const aggregatedPeriods = new Map<Period, MonthlyReport>

  for (const report of data) {
    // Extract all the keys from the detailed expenses and deduplicate if
    // present in multiple reports
    const firstLevelComponent = report.component
    const secondLevelComponents = uniqueDetailedExpenses.get(firstLevelComponent) ?? new Set()
    // Set the key in case the first level component is not already present in the map
    uniqueDetailedExpenses.set(firstLevelComponent, secondLevelComponents)

    for (const key of Object.keys(report.detailedExpenses)) {
      secondLevelComponents.add(key)
    }

    const period = report.period
    const aggregatedPeriod : MonthlyReport = aggregatedPeriods.get(period) ?? {
      period,
      income: 0,
      totalMonthExpenses: 0,
      detailedExpenses: {}
    }

    const mergedPeriod = mergeMonthlyReports(aggregatedPeriod, report)
    aggregatedPeriods.set(period, mergedPeriod)
  }

  return { aggregatedPeriods, uniqueDetailedExpenses }
}

const mergeMonthlyReports = (report1: MonthlyReport, report2: MonthlyReport) => {
  if(!isSamePeriod(report1.period, report2.period)){
    throw new Error("Cannot merge reports of different periods")
  }

  const detailedExpensesKeys = [...Object.keys(report1.detailedExpenses), ...Object.keys(report2.detailedExpenses)]
  const mergedDetailedExpense = []

  for (const key of detailedExpensesKeys) {


}

export const CostsProjectionComponent: React.FC<CostProjectionComponentProps> = (props: CostProjectionComponentProps) => {

  const rows = generateRows(props.data)


  // Flatten the monthly reports for computing the columns to display in the table
  const groupingData: Parameters<typeof determineColumnsGrouping>[0] = Array.from(props.dataNew.values()).flat()
  const columnsGrouping = determineColumnsGrouping(groupingData)

  console.log(columnsGrouping)

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size="small" aria-label="a dense table" border={1}>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={5}></TableCell>
            {
              Array.from(columnsGrouping.keys()).map(it => {
                return <TableCell align="center" colSpan={columnsGrouping.get(it)?.size ?? 0}>{it}</TableCell>
              })
            }
          </TableRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Income</TableCell>
            <TableCell align="right">Expenses</TableCell>
            <TableCell align="right">Delta</TableCell>
            {
              Array.from(columnsGrouping.keys()).reduce<string[]>((previousValue: string[], currentValue: string) => {
                const columns = columnsGrouping.get(currentValue)
                if (columns) {
                  for (const column of columns) {
                    previousValue.push(column)
                  }
                }
                return previousValue
              }, []).map(it => {
                return <TableCell align="center">{it}</TableCell>
              })
            }
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
              {
                const cells = []
                const
                for(const key of columnsGrouping.keys()) {
                  const columns = columnsGrouping.get(key)
                  if (columns) {
                    for (const column of columns) {
                      cells.push(<TableCell align="center">{row[column]}</TableCell>)
                    }
                  }
                }
                return cells
              }
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

const determineColumnsGrouping = (data: ReadonlyArray<Pick<MonthlyReport, "component" | "detailedExpenses">>) => {
  const grouping = new Map<string, Set<string>>()

  for (const report of data) {
    const groupKey = report.component
    const columns = grouping.get(groupKey) ?? new Set<string>()
    grouping.set(groupKey, columns)

    for (const key of Object.keys(report.detailedExpenses)) {
      columns.add(key)
    }
  }


  for (const key of grouping.keys()) {
    const columns = grouping.get(key)
    if (columns && columns.size == 0) {
      // Delete components that does not have any detailed expenses otherwise
      // the table alignment will be messed up between the first table head row
      // and the second one
      grouping.delete(key)
    }
  }

  return grouping
}

