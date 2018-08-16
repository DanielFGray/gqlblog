/* global __APPBASE:false, __DEV:false, __MOUNT:false */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from '../Routes'
import './style.css'

const Init = (
  <Router basename={__APPBASE}>
    <Routes />
  </Router>
)

const root = document.getElementById(__MOUNT)
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(Init, root)
})
