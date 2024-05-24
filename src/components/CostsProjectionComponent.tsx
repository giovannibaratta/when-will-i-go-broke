import { Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material"
import { green, orange, red } from "@mui/material/colors"
import React from "react"
import { Month, Period, Report } from "../model/monthly-report.ts"
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
  balanceForPeriod: number
  period: Period
  totalPeriodIncome: number
  totalPeriodExpenses: number
  cashflowForPeriod: number
  amountForColumn: Record<ColumnIdentifier, number>
}

type ColumnIdentifier = string

const generateRowsData = (periodReportsMap: Map<PeriodKey, Report[]>, detailedReportColumnsMetadata : DetailedReportColumnMetadata[]) => {
  const rows : Row[] = []

  const periods : Period[] = Array.from(periodReportsMap.keys()).map(keyToPeriod)
  // Rows must be sorted by period otherwise the balance will be wrong
  periods.sort((a, b) => a.year - b.year || a.month - b.month)

  let balanceForPeriod = 0

  for(const period of periods){
    const reports = periodReportsMap.get(periodToKey(period))

    if(!reports){
      // Do not generate a row if there are no reports for this period
      continue
    }

    const totalPeriodIncome = reports.filter(it => it.type === "Income").reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0)
    const totalPeriodExpenses = reports.filter(it => it.type === "Expense").reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0)
    const cashflowForPeriod = totalPeriodIncome - totalPeriodExpenses

    balanceForPeriod += cashflowForPeriod

    const amountForColumn : Record<ColumnIdentifier, number> = {}

    for(const columnMetadata of detailedReportColumnsMetadata){
      const amount = reports
        .filter(it => categoryComponentToColumnIdentifier(it.category, it.component) === columnMetadata.columnIdentifier)
        .map(it => it.amount)
        .reduce((prev : number, curr : number) => prev + curr, 0)

      amountForColumn[columnMetadata.columnIdentifier] = amount
    }

    rows.push({
      balanceForPeriod,
      period,
      totalPeriodIncome,
      totalPeriodExpenses,
      cashflowForPeriod,
      amountForColumn
    })
  }

  return rows
}

const prepareDataForRendering = (reports: ReadonlyArray<Report>) => {

  // Build a map where the key in the category and the value is a list of components for the given
  // category. We could extract these lists from the types but in this way we are sure to fill
  // only the ones that have a value.
  const categoryComponentsMap = new Map<string, Set<string>>()
  // Rearrange all the reports for a given period to ease the computation when displaying the data
  const periodReportsMap = new Map<PeriodKey, Report[]>()

  for (const report of reports) {
    const{ category, component, period } = report

    // Update the component categories map
    const components = categoryComponentsMap.get(category) ?? new Set()
    components.add(component)
    categoryComponentsMap.set(category, components)

    // Aggregate the periods
    const periodKey = periodToKey(period)
    const reportsForPeriod = periodReportsMap.get(periodKey) ?? []
    reportsForPeriod.push(report)
    periodReportsMap.set(periodKey, reportsForPeriod)
  }

  return { periodReportsMap, categoryComponentsMap }
}


interface FirstLevelHeader {
  label : string
  span : number
}

interface SecondLevelHeader {
  label : string
}

interface DetailedReportColumnMetadata {
  firstLevelHeaderLabel : string
  secondLevelHeaderLabel : string
  columnIdentifier : ColumnIdentifier
}

const generateTableMetadataForDetailedReport = (categoryComponentsMap: Map<string, Set<string>>) => {
  const firstLevelHeaders : FirstLevelHeader[] = []
  const secondLevelHeaders : SecondLevelHeader[] = []
  const detailedReportColumnsMetadata : DetailedReportColumnMetadata[] = []

  for(const [category, components] of categoryComponentsMap){
    firstLevelHeaders.push({
      label: category,
      span : components.size
    })

    for(const component of components) {
      secondLevelHeaders.push({
        label : component
      })

      detailedReportColumnsMetadata.push({
        firstLevelHeaderLabel: category,
        secondLevelHeaderLabel: component,
        columnIdentifier: categoryComponentToColumnIdentifier(category, component)
      })
    }
  }

  return {
    firstLevelHeaders,
    secondLevelHeaders,
    detailedReportColumnsMetadata
  }
}

export const CostsProjectionComponent: React.FC<CostProjectionComponentProps> = (props: CostProjectionComponentProps) => {

  const { data } = props

  const { periodReportsMap, categoryComponentsMap } = prepareDataForRendering(data)
  const {firstLevelHeaders, secondLevelHeaders, detailedReportColumnsMetadata } = generateTableMetadataForDetailedReport(categoryComponentsMap)

  //const uniqueComponents = Array.from(categoryComponentsMap.values()).map(setToArray).flat()
  const rows = generateRowsData(periodReportsMap, detailedReportColumnsMetadata )

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size="small" aria-label="a dense table" border={1}>
        <TableHead>
          <TableRow key={"first-level-header"}>
            <TableCell align="center" colSpan={5}></TableCell>
            {
              // Each category should be transformed to a first level header in the table
              firstLevelHeaders.map(it => {
                return <TableCell align="center" colSpan={it.span}>{it.label}</TableCell>
              })
            }
          </TableRow>
          <TableRow key={"second-level-header"}>
            <TableCell >Date</TableCell>
            <TableCell align="center">Balance</TableCell>
            <TableCell align="center">Income</TableCell>
            <TableCell align="center">Expenses</TableCell>
            <TableCell align="center">Delta</TableCell>
            {
              // Each component should be transformed to a second level header in the table
              secondLevelHeaders.map(it => {
                return <TableCell align="center">{it.label}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={periodToKey(row.period)}>
              <TableCell component="th" scope="row">
                {prettyPrintPeriod(row.period)}
              </TableCell>
              <TableCell sx={computeBalanceStyle(row.balanceForPeriod)}
                         align="right">{formatNumberToEuro(row.balanceForPeriod)}</TableCell>
              <TableCell align="right">{formatNumberToEuro(row.totalPeriodIncome)}</TableCell>
              <TableCell align="right">{formatNumberToEuro(row.totalPeriodExpenses)}</TableCell>
              <TableCell sx={computeDeltaStyle(row.cashflowForPeriod)} align="right">{formatNumberToEuro(row.cashflowForPeriod)}</TableCell>
              {
                detailedReportColumnsMetadata.map(columnMetadata => (
                  <TableCell align="center">
                    {
                      formatNumberToEuro(row.amountForColumn[columnMetadata.columnIdentifier] ?? 0)
                    }
                  </TableCell>
                ))
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

// PeriodKey is used to identify the period in the map since Javascript implementation
// does not support object comparison in the map
type PeriodKey = string

function periodToKey(period: Period) : PeriodKey {
  return `${period.year}-${period.month}`
}

function keyToPeriod(key: PeriodKey) : Period {
  const [year, month] = key.split('-').map(Number)
  return { year, month }
}

function prettyPrintPeriod(period: Period) : string {

  return `${monthToString(period.month)} ${period.year}`
}

function monthToString(month: Month) : string {
  return Month[month]
}

function categoryComponentToColumnIdentifier(category: string, component: string) : ColumnIdentifier {
  return `${category}-${component}`
}

