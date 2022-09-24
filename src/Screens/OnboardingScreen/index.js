import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppText, Container } from '@/Components'
import Animated from 'react-native-reanimated'

const OnboardingScreen = () => {
  return (
    <Container disableTop>
      <Animated.FlatList />
    </Container>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({})
