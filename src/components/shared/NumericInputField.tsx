import React, {useState} from "react"
import {InputAdornment, TextField, TextFieldProps} from "@mui/material"
import {Either, isRight} from "fp-ts/Either"
import {either} from "fp-ts"


export interface NumericInputFieldProps extends Omit<TextFieldProps<'outlined'>, 'onChange' | 'variant' | 'type' | 'InputProps' | 'error' | 'helperText'> {
  validate?: (value: number) => Either<string, true>
  onValueChange?: (newValue: number) => void
  suffix?: string
}

export const NumericInputField: React.FC<NumericInputFieldProps> = (props: NumericInputFieldProps) => {

  const { validate, onValueChange, suffix, ...childProps } = props
  const [isValidValue, setIsValidValue] = useState<boolean>()
  const [errorMessage, setErrorMessage] = useState<string>("")

  const clearErrorMessage = () => setErrorMessage("")

  const onChangeCallback = onValueChange

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCallbackDefined = onChangeCallback !== undefined
    const convertedValue = parseFloat(event.target.value)
    const validationResult = validate ? validate(convertedValue) : either.right(true)

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
    <TextField id="numeric-input-field" variant="outlined"
               onChange={onChange} type={"number"} sx={{padding: "5px"}} InputProps={suffix ? {
      endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>
    } : {}
    } error={isValidValue !== undefined && !isValidValue} helperText={errorMessage} {...childProps} />
  )
}
