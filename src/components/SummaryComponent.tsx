import {Paper} from "@mui/material"
import {Report} from "./CostsProjectionComponent.tsx"
import React from "react"
import {formatNumberToEuro} from "../utils/print.ts"

export interface SummaryComponentProps {
  simulationStartDate: Date,
  simulationEndingDate: Date,
  records: ReadonlyArray<Report>
}

export const SummaryComponent: React.FC<SummaryComponentProps> = (props: SummaryComponentProps) => {

  const {records, simulationEndingDate, simulationStartDate} = props

  const summary = records.reduce<{
    readonly totalExpenses: number,
    readonly totalIncome: number
  }>((acc, cur: Report) => {
    return {
      totalExpenses: acc.totalExpenses + cur.totalMonthExpenses,
      totalIncome: acc.totalIncome + cur.income
    }
  }, {totalExpenses: 0, totalIncome: 0})

  const {totalExpenses, totalIncome} = summary
  const balance = totalIncome - totalExpenses

  return (
    <>
      <div>Start date: {simulationStartDate.toDateString()} End
        date: {simulationEndingDate.toDateString()}</div>
      <Paper>
        <h3>Balance {formatNumberToEuro(balance)}</h3>
      </Paper>
      <Paper>
        <h3>Total expenses {formatNumberToEuro(totalExpenses)}</h3>
      </Paper>
      <Paper>
        <h3>Total income {formatNumberToEuro(totalIncome)}</h3>
      </Paper>
    </>
  )
}
