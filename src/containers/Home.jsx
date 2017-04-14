// @flow
import React from 'react'
import SomeList from 'components/SomeList'

const Home = () => {
  const list = [ 1, 2, 3, 'foo' ]

  return (
    <SomeList name="world" list={list} />
  )
}

export default Home
