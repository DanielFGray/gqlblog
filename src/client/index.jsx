import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from '../Routes'
import './style.css'

const Init = (
  <Router>
    <Routes />
  </Router>
)

const root = document.getElementById('root')
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(Init, root)
})
