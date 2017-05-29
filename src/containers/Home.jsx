// @flow
import React from 'react'
import { provideState } from 'freactal'
import SomeList from '../components/SomeList'

import styles from '../style.sss'

const Provider = provideState({
  initialState: () => ({ list: [1, 2, 3] }),
  effects: {
    addItem: (effects, newVal) => state =>
      ({ ...state, list: state.list.concat(newVal) }),
  },
})

const Home = Provider(() => (
  <div className={styles.card}>
    <SomeList />
  </div>))

export default Home
