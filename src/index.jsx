// @flow
import React from 'react'
import { render } from 'react-dom'

import SomeList from 'components/SomeList'
import 'style.sss'

const someList = [ 1, 2, 3, 4 ]

render(<SomeList name="world" list={someList} />, document.getElementById('main'))
