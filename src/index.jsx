// @flow
import React from 'react'
import { render } from 'react-dom'

import SomeList from 'components/SomeList'
import 'style.sss'

const someList = [
  'foo',
  'bar',
  'baz',
]

render(<SomeList name="world" list={someList} />, document.getElementById('main'))
