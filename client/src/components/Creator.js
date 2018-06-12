import React from 'react'

import client from '../client'

export default class Creator extends React.Component {
  state = {
    texts: []
  }

  componentDidMount() {
    this.getCreator()
  }

  getCreator = () => {
    client.fetchCreator()
      .then((texts) => {
        this.setState({
          texts: texts
        })
      })
  }

  render() {
    return (
      <div className='mx-auto pt-3 px-3 content-container maker-container'>
        <h2 className='mb-3'>Matt Groening</h2>
        <h4 className='mb-3 px-3'>Creator of the Simpsons & Futurama television shows</h4>
        <img className='img-fluid rounded border border-dark mb-3' src='/images/matt-groening.jpg' alt='' />
        <div>
          {
      this.state.texts.map((text, index) => (
        <p key={index} className='lead px-3'>{text}</p>
      ))
      }
        </div>
      </div>
    )
  }
}
