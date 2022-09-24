export const formatCurrency = (number, delimiter = ',') => {
  return Number.isNaN(number)
    ? 0
    : number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter)
}

export function formatCurrencyD(number) {
  return formatCurrency(number) + ' ₫'
}

export function formatCurrencyVND(number) {
  return formatCurrency(number * 1000) + ' VNĐ'
}
