import React, {useEffect, useState} from "react"
import {CurrencyInputField} from "./shared/CurrencyInputField"
import {Paper, Stack, Typography} from "@mui/material"
import {miscellaneuosActions} from "../state/miscellaneous/miscellaneous-reducer.ts"
import {useAppDispatch, useAppSelector} from "../state/store.ts"

interface MiscellaneousCostsProps {
}

export const MiscellaneousCostsComponent: React.FC<MiscellaneousCostsProps> = () => {
  const state = useAppSelector((state) => state.miscellaneous)
  const [canoneRai, setCanoneRai] = useState(state.canoneRai)
  const [tari, setTari] = useState(state.tari)

  const handleCanoneRaiChange = (value: number) => {
    setCanoneRai(value)
  }

  const handleTariChange = (value: number) => {
    setTari(value)
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(miscellaneuosActions.setCanoneRai(canoneRai))
  }, [dispatch, canoneRai])

  useEffect(() => {
    dispatch(miscellaneuosActions.setTari(tari))
  }, [dispatch, tari])

  return (
    <Paper sx={{width: "100%", p: 2}}>
      <Stack spacing={2}>
        <Typography variant="h4">Miscellaneous Costs</Typography>
        <CurrencyInputField
          label="Canone RAI"
          value={canoneRai}
          onValueChange={handleCanoneRaiChange}
        />
        <CurrencyInputField
          label="Tari"
          value={tari}
          onValueChange={handleTariChange}
        />
      </Stack>
    </Paper>
  )
}
