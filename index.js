/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import './src/Translations/i18n'
import 'react-native-gesture-handler'
import { configure } from 'mobx'
LogBox.ignoreLogs([/.*/])
AppRegistry.registerComponent(appName, () => App)
configure({
  useProxies: 'always',
  enforceActions: 'never',
})
