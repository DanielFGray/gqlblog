// @flow
import React from 'react'
import Provider from '../actions'
import SomeList from '../components/SomeList'
import UserThing from '../components/UserThing'

const Home = () => (
  <div>
    <SomeList />
    <UserThing />
  </div>
)

export default Provider(Home)
