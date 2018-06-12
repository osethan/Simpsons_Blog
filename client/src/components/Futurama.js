import React from 'react'

import client from '../client'

export default class Futurama extends React.Component {
  state = {
    futurama: []
  }

  componentDidMount() {
    this.getFuturama()
  }

  getFuturama = () => {
    client.fetchFuturama()
      .then((futurama) => {
        this.setState({
          futurama: futurama
        })
      })
  }

  render() {
    return (
      <div className='mx-auto pt-3 px-3 content-container character-container'>
        <h2 className='mb-3'>Futurama Crew</h2>
        <div>
          {
      this.state.futurama.map((member, index) => {
        const imageName = member.name.toLowerCase().replace(/\./g, '').replace(/\s/g, '-')

        return (
          <div key={index} className='row mb-3'>
            <div className='col-sm-5 align-self-center crew-inline'>
              <p className='lead font-weight-bold'>{member.name}</p>
              <p className='lead'>{member.blurb}</p>
            </div>
            <div className='col-sm-7 crew-inline'>
              <img className='img-fluid' src={`/images/${imageName}.png`} alt='' />
            </div>
            <div className='col-sm-7 crew-stack'>
              <img className='img-fluid' src={`/images/${imageName}.png`} alt='' />
            </div>
            <div className='col-sm-5 align-self-center crew-stack'>
              <p className='lead font-weight-bold'>{member.name}</p>
              <p className='lead'>{member.blurb}</p>
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
