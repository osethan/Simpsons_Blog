import React from 'react'

import client from '../client'

export default class Simpsons extends React.Component {
  state = {
    simpsons: []
  }

  componentDidMount() {
    this.getSimpsons()
  }

  getSimpsons = () => {
    client.fetchSimpsons()
      .then((simpsons) => {
        this.setState({
          simpsons: simpsons
        })
      })
  }

  render() {
    return (
      <div className='mx-auto pt-3 px-3 content-container character-container'>
        <h2 className='mb-3'>Simpson Family</h2>
        <div>
          {
      this.state.simpsons.map((simpson, index) => {
        const imageName = simpson.name.toLowerCase().replace(/\s/g, '-')

        return (
          <div key={index} className='row mb-3'>
                  <div className='col-sm-7'>
                    <img className='img-fluid' src={`/images/${imageName}.png`} alt='' />
                  </div>
                  <div className='col-sm-5 align-self-center'>
                    <p className='lead font-weight-bold'>{simpson.name}</p>
                    <p className='lead'>{simpson.blurb}</p>
                  </div>
                </div>
        )
      })
      }
        </div>
      </div>
    )
  }
}
