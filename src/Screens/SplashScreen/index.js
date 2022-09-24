import { Container } from '@/Components'
import { useAppTheme } from '@/Hooks'
import { screenWidth, XStyleSheet } from '@/Theme'
import React from 'react'
import { Image } from 'react-native'

const Splash = () => {
  const { Images } = useAppTheme()
  return (
    <Container style={styles.container} disableTop>
      <Image style={styles.bgImage} source={Images.banner} />
    </Container>
  )
}

export default Splash

const styles = XStyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    ...XStyleSheet.absoluteFillObject,
    width: screenWidth,
    skipResponsive: true,
  },
})
