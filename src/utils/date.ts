export function getFirstDayOfNextMonthsFrom(now: Date, numberOfMonths: number): Date {
  console.assert(numberOfMonths > 0)
  const currentMonth = now.getMonth()
  const targetMonth = currentMonth + numberOfMonths

  const yearIncrements = targetMonth % 12
  const newYear = yearIncrements < 0 ? now.getFullYear() : now.getFullYear() + yearIncrements
  const newMonth = yearIncrements < 0 ? targetMonth : targetMonth - (12 * yearIncrements)

  return new Date(newYear, newMonth, 1)
}
