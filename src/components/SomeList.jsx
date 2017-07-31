// @flow
import React from 'react'
import { injectState } from 'freactal'

import styles from './list.sss'
import ItemEntry from './ItemEntry'

const SomeList = ({ state, effects }: {
  effects: {
    addItem: Function, // eslint-disable-line react/no-unused-prop-types
  },
  state: {
    list: Array<number>, // eslint-disable-line react/no-unused-prop-types
  },
}) => (
  <div className={styles.list}>
    <ItemEntry addItem={effects.addItem} />
    <ul>
      {state.list.map(e =>
        <li key={e}>{e} * {e} = {e * e}</li>)}
    </ul>
  </div>
)

export default injectState(SomeList)
