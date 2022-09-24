import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class DiaLogStore {
  show = false
  title = ''
  message = ''
  dialogIcon = null
  buttonText = 'OK'
  buttonCustom = null
  buttonProps = {}
  customMessage = null
  footer = null
  hideCloseButton = false
  messageColor = ''
  messageStyle = ''
  showTime = 0
  titleColor = ''
  backdropForClosing = false
  onClose = () => {}
  onPress = () => {}

  constructor() {
    makeAutoObservable(this)
  }

  showDiaLog({
    title = '',
    message = '',
    dialogIcon = null,
    buttonText = 'OK',
    buttonCustom = null,
    buttonProps = {},
    customMessage = null,
    footer = null,
    hideCloseButton = false,
    messageColor = '',
    messageStyle = '',
    showTime = 0,
    titleColor = '',
    backdropForClosing = false,
    onClose = () => {},
    onPress = () => {},
  }) {
    this.show = true
    this.title = title
    this.message = message
    this.dialogIcon = dialogIcon
    this.buttonText = buttonText
    this.buttonCustom = buttonCustom
    this.buttonProps = buttonProps
    this.customMessage = customMessage
    this.footer = footer
    this.hideCloseButton = hideCloseButton
    this.messageColor = messageColor
    this.messageStyle = messageStyle
    this.showTime = showTime
    this.titleColor = titleColor
    this.backdropForClosing = backdropForClosing
    this.onPress = onPress
    this.onClose = onClose
  }

  closeDiaLog() {
    this.show = false
    this.onClose()
    this.resetData()
  }

  resetData() {
    this.title = ''
    this.message = ''
    this.dialogIcon = null
    this.buttonText = 'OK'
    this.buttonCustom = null
    this.buttonProps = {}
    this.customMessage = null
    this.footer = null
    this.hideCloseButton = false
    this.messageColor = ''
    this.messageStyle = ''
    this.showTime = 0
    this.titleColor = ''
    this.backdropForClosing = false
    this.onClose = () => {}
    this.onPress = () => {}
  }

  // check for hydration (required)
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
