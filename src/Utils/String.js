export const capitializeFirstLetter = (str = '') => {
  return str === null ? '' : str.charAt(0).toUpperCase() + str.slice(1)
}
export const capitalize = (str = '') => {
  return str === null
    ? ''
    : str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
}
