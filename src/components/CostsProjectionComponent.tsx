import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import React from "react"

interface CostProjectionComponentProps {
  data: ReadonlyArray<Report>
}

export interface Report {
  readonly date: Date
  readonly income: number
  readonly totalMonthExpenses: number
}

export const CostsProjectionComponent: React.FC<CostProjectionComponentProps> = (props: CostProjectionComponentProps) => {

  const rows = props.data.map(it => {
      return {
        date: it.date,
        income: it.income,
        totalMonthExpenses: it.totalMonthExpenses,
        delta: it.income - it.totalMonthExpenses
      }
    }
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
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
              <TableCell align="right">{row.income}</TableCell>
              <TableCell align="right">{row.totalMonthExpenses}</TableCell>
              <TableCell align="right">{row.delta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
