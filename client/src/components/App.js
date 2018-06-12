import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home'

import '../styles/App.css'

const NotFound = () => (
  <div className='container-fluid'>
    <div className='mx-auto text-center my-5 content-container not-found'>
      <h1>Page Not Found</h1>
    </div>
  </div>
)

const App = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default App
