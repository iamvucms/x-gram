import { AppText, Container } from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { XStyleSheet } from '@/Theme'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const HomeScreen = () => {
  return <Container style={styles.rootView}></Container>
}

export default HomeScreen

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})
