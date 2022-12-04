import { Container } from '@/Components'
import { XStyleSheet } from '@/Theme'
import React from 'react'

const EditPostScreen = ({ route }) => {
  const { postId } = route.params
  console.log({ postId })
  return <Container></Container>
}

export default EditPostScreen

const styles = XStyleSheet.create({})
