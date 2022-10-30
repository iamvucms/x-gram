import { Container } from '@/Components'
import { Colors, XStyleSheet } from '@/Theme'
import React from 'react'

const SearchScreen = () => {
  return <Container style={styles.rootView}></Container>
}

export default SearchScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
})
