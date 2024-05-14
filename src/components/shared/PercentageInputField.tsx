import React from "react"
import {NumericInputField, NumericInputFieldProps} from "./NumericInputField.tsx"


interface PercentageInputFieldProps extends Omit<NumericInputFieldProps, "suffix" | "inputProps"> {
  step?: number
}

export const PercentageInputField: React.FC<PercentageInputFieldProps> = (props: PercentageInputFieldProps) => {

  const inputProps = {
    min: 0,
    max: 100,
    ...(props.step && {step: props.step})
  }

  return (
    <NumericInputField label={props.label} onValueChange={props.onValueChange} validate={props.validate}
                       suffix={"%"} inputProps={inputProps} {...props} />
  )
}
