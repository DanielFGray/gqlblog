// @flow
import React from 'react'
import { injectState } from 'freactal'

import styles from './list.sss'
import ItemEntry from './ItemEntry'

const SomeList = injectState(({ state }) =>
  <div className={styles.list}>
    <ItemEntry />
    <ListView list={state.list} />
  </div>)

const ListView = ({ list }: { list: Array<number> }) =>
  <ul>
    {list.map(e =>
      <li key={e}>{e} * {e} = {e * e}</li>)}
  </ul>

export default SomeList
