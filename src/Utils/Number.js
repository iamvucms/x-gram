export const generateRandomIntegerInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const roundNumber = (money, precision = 0, isRoundDown = false) => {
  const roundFunc = isRoundDown ? Math.floor : Math.round
  return roundFunc(money * Math.pow(10, precision)) / Math.pow(10, precision)
}

export const formatAmount = (amount = 0) => {
  if (amount > 999999) {
    return `${roundNumber(amount / 1000000, 1)}m`
  }
  if (amount > 999) {
    return `${roundNumber(amount / 1000, 1)}k`
  }
  return amount
}
