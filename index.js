/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import './src/Translations/i18n'
import 'react-native-gesture-handler'
LogBox.ignoreLogs(['Require cycle:'])
AppRegistry.registerComponent(appName, () => App)
