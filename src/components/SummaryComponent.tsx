import {Paper} from "@mui/material"
import React from "react"
import {formatNumberToEuro} from "../utils/print.ts"
import { Report } from "../model/monthly-report.ts"

export interface SummaryComponentProps {
  simulationStartDate: Date,
  simulationEndingDate: Date,
  records: ReadonlyArray<Report>
}

interface Summary {
  readonly totalExpenses: number,
  readonly totalIncome: number
}

export const SummaryComponent: React.FC<SummaryComponentProps> = (props: SummaryComponentProps) => {

  const {records, simulationEndingDate, simulationStartDate} = props

  const summary = records.reduce<Summary>((acc, cur: Report) => {

    const recordExpenses = cur.type === "Expense" ? cur.amount : 0
    const recordIncome = cur.type === "Income" ? cur.amount : 0

    return {
      totalExpenses: acc.totalExpenses + recordExpenses,
      totalIncome: acc.totalIncome + recordIncome
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
