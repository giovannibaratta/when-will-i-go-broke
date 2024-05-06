import React, {useState} from "react"
import {InputAdornment, TextField} from "@mui/material"
import {Either, isRight} from "fp-ts/Either"
import {either} from "fp-ts"


interface NumericInputFieldProps {
  defaultValue?: number
  label: string
  validate?: (value: number) => Either<string, true>
  onChange?: (newValue: number) => void
  suffix?: string
}

export const NumericInputField: React.FC<NumericInputFieldProps> = (props: NumericInputFieldProps) => {

  const [isValidValue, setIsValidValue] = useState<boolean>()
  const [errorMessage, setErrorMessage] = useState<string>("")

  const clearErrorMessage = () => setErrorMessage("")

  const onChangeCallback = props.onChange

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCallbackDefined = onChangeCallback !== undefined
    const convertedValue = parseFloat(event.target.value)
    const validationResult = props.validate ? props.validate(convertedValue) : either.right(true)

    if (isRight(validationResult)) {
      setIsValidValue(true)
      clearErrorMessage()
      if (isCallbackDefined) {
        onChangeCallback(convertedValue)
      }
    } else {
      setIsValidValue(false)
      setErrorMessage(validationResult.left)
    }
  }

  return (
    <TextField id="numeric-input-field" defaultValue={props.defaultValue} label={props.label} variant="outlined"
               type={"number"} onChange={onChange} sx={{padding: "5px"}} InputProps={props.suffix ? {
      endAdornment: <InputAdornment position="end">{props.suffix}</InputAdornment>
    } : {}
    } error={isValidValue !== undefined && !isValidValue} helperText={errorMessage} />
  )
}
