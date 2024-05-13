export const formatNumberToEuro = (value: number, options?: {
  decimalDigits?: number
}): string => {

  const defaultOptions = {
    decimalDigits: 2
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options
  }

  return value.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: mergedOptions.decimalDigits
  })
}
