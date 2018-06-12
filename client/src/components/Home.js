import React from 'react'

import Simpsons from './Simpsons'
import Futurama from './Futurama'
import Creator from './Creator'
import Comments from './Comments'

export default class Home extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <div className='text-center'>
          <h1 className='my-3'>Welcome to the Simpsons & Futurama Blog</h1>
        </div>
        <div className='text-center mb-3'>
          <Simpsons />
        </div>
        <div className='text-center mb-3'>
          <Futurama />
        </div>
        <div className='text-center mb-3'>
          <Creator />
        </div>
        <div className='text-center mb-3'>
          <Comments />
        </div>
      </div>
    )
  }
}
