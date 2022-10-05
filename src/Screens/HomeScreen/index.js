import { Container } from '@/Components'
import { Colors, XStyleSheet } from '@/Theme'
import React from 'react'
import { StoryBar } from './HomeScreenComponents'

const HomeScreen = () => {
  return (
    <Container
      safeAreaColor={Colors.k222222}
      disableTop={false}
      style={styles.rootView}
      statusBarProps={{ barStyle: 'light-content' }}
    >
      <StoryBar />
    </Container>
  )
}

export default HomeScreen
const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})
