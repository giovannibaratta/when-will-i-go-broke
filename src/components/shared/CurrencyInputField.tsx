import React from "react"
import {NumericInputField, NumericInputFieldProps} from "./NumericInputField.tsx"


interface CurrencyInputFieldProps extends Omit<NumericInputFieldProps, 'suffix'> {
}

export const CurrencyInputField: React.FC<CurrencyInputFieldProps> = (props: CurrencyInputFieldProps) => {
  return (
    <NumericInputField label={props.label} onValueChange={props.onValueChange} validate={props.validate}
                       defaultValue={props.defaultValue} suffix={"€"} {...props}/>
  )
}
