import { AppButton, Container } from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Layout } from '@/Theme'
import React from 'react'
import Config from 'react-native-config'

const HomeScreen = () => {
  console.log(Config)
  return (
    <Container style={Layout.center}>
      <AppButton
        onPress={() => navigate(PageName.ExampleScreen)}
        text="Example"
      />
    </Container>
  )
}

export default HomeScreen
