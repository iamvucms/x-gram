import { Container } from '@/Components'
import { XStyleSheet } from '@/Theme'
import React from 'react'

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
