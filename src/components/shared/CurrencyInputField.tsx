import React from "react"
import {Either} from "fp-ts/Either"
import {NumericInputField} from "./NumericInputField.tsx"


interface CurrencyInputFieldProps {
  defaultValue?: number
  label: string
  validate?: (value: number) => Either<string, true>
  onChange?: (newValue: number) => void
}

export const CurrencyInputField: React.FC<CurrencyInputFieldProps> = (props: CurrencyInputFieldProps) => {
  return (
    <NumericInputField label={props.label} onChange={props.onChange} validate={props.validate}
                       defaultValue={props.defaultValue} suffix={"€"} />
  )
}
