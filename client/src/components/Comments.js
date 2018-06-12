import React from 'react'
import moment from 'moment-timezone'
import md5 from 'md5'

import client from '../client'

export default class Comments extends React.Component {
  state = {
    comments: [],
    newComments: {},
    commentEdits: {},
    username: '',
    password: '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    authMsg: ''
  }

  componentDidMount() {
    this.getComments()
  }

  onLoginSubmit = (event) => {
    event.preventDefault()

    const username = this.state.username
    const password = this.state.password

    if (!username || !password || username.length > 16) {
      this.setState({
        authMsg: 'Invalid credentials'
      })
      return
    }

    client.dispatchLogin(username, password)
      .then((data) => {
        const user = data.user
        const message = data.message

        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.setState({
            user: user,
            username: '',
            password: '',
            authMsg: ''
          })
        } else if (message) {
          this.setState({
            authMsg: message
          })
        }
      })
  }

  onSignupSubmit = (event) => {
    event.preventDefault()

    const username = this.state.username
    const password = this.state.password

    if (username.length < 1 || username.length > 16) {
      this.setState({
        authMsg: 'Username must be between 1 - 16 characters'
      })
      return
    }

    if (!password) {
      this.setState({
        authMsg: 'Must provide a password'
      })
      return
    }

    client.dispatchSignup(username, password)
      .then((data) => {
        const user = data.user
        const message = data.message

        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.setState({
            user: user,
            username: '',
            password: '',
            authMsg: ''
          })
        } else if (message) {
          this.setState({
            authMsg: message
          })
        }
      })
  }

  onLogoutSubmit = (event) => {
    event.preventDefault()
    client.dispatchLogout()
      .then(() => {
        localStorage.setItem('user', '{}')
        this.setState({
          user: {}
        })
      })
  }

  onUsernameChange = (event) => {
    const username = event.target.value

    this.setState({
      username: username
    })
  }

  onPasswordChange = (event) => {
    const password = event.target.value

    this.setState({
      password: password
    })
  }

  onCommentSubmit = (event, parentId, newCommentIdx) => {
    event.preventDefault()

    const loggedIn = this.state.user.username

    if (loggedIn) {
      const message = this.state.newComments[newCommentIdx]
      if (!message) {
        return
      }

      const username = this.state.user.username
      const isoTime = moment().toISOString()
      const id = md5(username + '-' + isoTime)
      const timestamp = moment(isoTime).tz(moment.tz.guess()).format('dddd, MMM Do YYYY, h:mm:ssA z')
      const comment = {
        id: id,
        username: username,
        comment: message,
        isoTime: isoTime,
        timestamp: timestamp,
        parentId: parentId,
        children: []
      }
      const comments = this.state.comments
      const newComments = this.state.newComments

      if (comment.parentId === '') {
        comments.unshift(comment)
      } else {
        comments.forEach((comm) => {
          if (comm.id === comment.parentId) {
            comm.children.push(comment)
          }
        })
      }

      delete newComments[newCommentIdx]
      this.setState({
        comments: comments,
        newComments: newComments
      })
      client.dispatchComment(comment)
    }
  }

  onCommentChange = (event, newCommentIdx) => {
    const comment = event.target.value
    const newComments = this.state.newComments

    newComments[newCommentIdx] = comment
    this.setState({
      newComments: newComments
    })
  }

  onCommentEdit = (event, id) => {
    event.preventDefault()

    const commentEdits = this.state.commentEdits

    commentEdits[id] = true
    this.setState({
      commentEdits: commentEdits
    })
  }

  onCommentEditChange = (event, id) => {
    const comment = event.target.value
    const comments = this.state.comments

    comments.forEach((comm) => {
      if (comm.id === id) {
        comm.comment = comment
      } else {
        comm.children.forEach((childComm) => {
          if (childComm.id === id) {
            childComm.comment = comment
          }
        })
      }
    })
    this.setState({
      comments: comments
    })
  }

  onCommentEditSubmit = (event, id) => {
    event.preventDefault()

    const comments = this.state.comments
    const commentEdits = this.state.commentEdits
    let comment

    comments.forEach((comm) => {
      if (comm.id === id) {
        comment = comm.comment
      } else {
        comm.children.forEach((childComm) => {
          if (childComm.id === id) {
            comment = childComm.comment
          }
        })
      }
    })

    delete commentEdits[id]
    this.setState({
      commentEdits: commentEdits
    })

    client.dispatchCommentUpdate({
      id: id,
      comment: comment
    })
  }

  onDeleteClick = (event, id) => {
    event.preventDefault()

    const comments = this.state.comments.map((comm) => {
      if (comm.id === id) {
        return
      }

      const children = comm.children.map((childComm) => {
        if (childComm.id !== id) {
          return childComm
        }
      }).filter((childComm) => {
        return childComm
      })

      comm.children = children
      return comm
    }).filter((comm) => {
      return comm
    })

    this.setState({
      comments: comments
    })

    client.dispatchCommentDelete(id)
  }

  getComments = () => {
    client.fetchComments()
      .then((comments) => {
        this.setState({
          comments: comments
        })
      })
  }

  renderAuthForm = () => {
    const loggedIn = this.state.user.username

    return (
      <div className='mb-3'>
        {
      loggedIn ?
        <button className='w-100 comment-button' type='button' onClick={this.onLogoutSubmit}>
              Logout
            </button> :
        <div>
              <form className='form-inline comment-box-inline'>
                <div className='d-flex justify-content-around'>
                  <input className='w-25 mr-3 px-3 comment-input' type='text' placeholder='Username' value={this.state.username} onChange={this.onUsernameChange} />
                  <input className='w-25 mr-3 px-3 comment-input' type='password' placeholder='Password' value={this.state.password} onChange={this.onPasswordChange} />
                  <button className='w-25 mr-3 px-3 comment-button' type='submit' onClick={this.onLoginSubmit}>
                    Login
                  </button>
                  <button className='w-25 px-3 comment-button' type='submit' onClick={this.onSignupSubmit}>
                    Signup
                  </button>
                </div>
              </form>
              <form className='comment-box-stack'>
                <input className='w-100 mb-3 px-3 comment-input' type='text' placeholder='Username' value={this.state.username} onChange={this.onUsernameChange} />
                <input className='w-100 mb-3 px-3 comment-input' type='password' placeholder='Password' value={this.state.password} onChange={this.onPasswordChange} />
                <button className='w-100 mb-3 px-3 comment-button' type='submit' onClick={this.onLoginSubmit}>
                  Login
                </button>
                <button className='w-100 px-3 comment-button' type='submit' onClick={this.onSignupSubmit}>
                  Signup
                </button>
              </form>
            </div>
      }
        <div>
          {
      this.state.authMsg ?
        <p className='lead mt-3'>{this.state.authMsg}</p> :
        null
      }
        </div>
      </div>
    )
  }

  renderCommentForm = (message, newCommentIdx) => {
    const parentId = message.parentId

    return (
      <div className='mb-3'>
        <form className='form-inline comment-box-inline'>
          <div className='d-flex justify-content-around'>
            <textarea className='w-75 mr-3 px-3 comment-input' placeholder={message.type} value={this.state.newComments[newCommentIdx] || ''} onChange={(event) => {
        this.onCommentChange(event, newCommentIdx)
      }} />
            <button className='align-self-start w-25 px-3 comment-button' type='button' onClick={(event) => {
        this.onCommentSubmit(event, parentId, newCommentIdx)
      }}>
              Submit
            </button>
          </div>
        </form>
        <form className='comment-box-stack'>
          <textarea className='w-100 mb-3 px-3 comment-input' placeholder={message.type} value={this.state.newComments[newCommentIdx] || ''} onChange={(event) => {
        this.onCommentChange(event, newCommentIdx)
      }} />
          <button className='w-100 px-3 comment-button' type='button' onClick={(event) => {
        this.onCommentSubmit(event, parentId, newCommentIdx)
      }}>
            Submit
          </button>
        </form>
      </div>
    )
  }

  renderComment = (comment, newCommentIdx) => {
    const loggedIn = this.state.user.username
    let message

    if (comment.parentId === '') {
      message = {
        parentId: comment.id,
        type: 'Reply'
      }
    }

    return (
      <div>
        <div className='comment-box-inline'>
          <div className='d-flex justify-content-around'>
          <p className='lead font-weight-bold mr-3'>{comment.username}</p>
          <p className='mr-3'>{comment.timestamp}</p>
          <div>
            {
      !loggedIn || comment.username !== this.state.user.username ?
        null :
        !this.state.commentEdits[comment.id] ?
          <div className='d-flex justify-content-around'>
                    <button className='mr-3 header-button' type='button' onClick={(event) => {
            this.onCommentEdit(event, comment.id)
          }}>
                      Edit
                    </button>
                    <button className='header-button' type='button' onClick={(event) => {
            this.onDeleteClick(event, comment.id)
          }}>
                      Delete
                    </button>
                  </div> :
          <button className='header-button' type='button' onClick={(event) => {
            this.onCommentEditSubmit(event, comment.id)
          }}>
                    Submit
                  </button>
      }
          </div>
        </div>
        </div>
        <div className='comment-box-stack'>
          <p className='lead font-weight-bold w-100 mb-3'>{comment.username}</p>
          <p className='w-100 mb-3'>{comment.timestamp}</p>
          <div className='mb-3'>
            {
      !loggedIn || comment.username !== this.state.user.username ?
        null :
        !this.state.commentEdits[comment.id] ?
          <div className='d-flex justify-content-around'>
                    <button className='w-50 mr-3 header-button' type='button' onClick={(event) => {
            this.onCommentEdit(event, comment.id)
          }}>
                      Edit
                    </button>
                    <button className='w-50 header-button' type='button' onClick={(event) => {
            this.onDeleteClick(event, comment.id)
          }}>
                      Delete
                    </button>
                  </div> :
          <button className='w-100 header-button' type='button' onClick={(event) => {
            this.onCommentEditSubmit(event, comment.id)
          }}>
                    Submit
                  </button>
      }
          </div>
        </div>
        <div>
          {
      this.state.commentEdits[comment.id] ?
        <form>
              <textarea className='lead text-left w-100 mb-3 px-3 comment-input' value={comment.comment} onChange={(event) => {
          this.onCommentEditChange(event, comment.id)
        }}/>
            </form> :
        <p className='lead text-left'>{comment.comment}</p>
      }
        </div>
        <div>
          {
      loggedIn && comment.parentId === '' ?
        <div>
                {
        this.renderCommentForm(message, newCommentIdx)
        }
              </div> :
        null
      }
        </div>
      </div>
    )
  }

  renderComments = () => {
    return (
      <div>
        {
      this.state.comments.map((comment, i) => {
        const newCommentIdx = i + 1

        return (
          <div key={'' + i + 0} className='mx-auto w-100 mb-3 p-3 content-container'>
            <div>
              {this.renderComment(comment, newCommentIdx)}
            </div>
            <div>
              {
          comment.children.map((child, j, array) => {
            return (
              j < array.length - 1 ?
                <div key={'' + i + j} className='mx-auto w-100 mb-3 p-3 content-container'>
                  {
                    this.renderComment(child)
                  }
                </div> :
                <div key={'' + i + j} className='mx-auto w-100 p-3 content-container'>
                  {
                    this.renderComment(child)
                  }
                </div>
            )
          })
          }
            </div>
          </div>
        )
      })
      }
      </div>
    )
  }

  render() {
    const message = {
      parentId: '',
      type: 'Comment'
    }
    const newCommentIdx = 0
    const loggedIn = this.state.user.username

    return (
      <div className='mx-auto pt-3 px-3 content-container maker-container'>
        <h2 className='mb-3'>Comments</h2>
        <p className='lead font-weight-bold'>Feel free to leave a comment if you like the Simpsons or Futurama</p>
        <p className='lead'>Must be logged in to comment</p>
        <div>
          {this.renderAuthForm()}
        </div>
        <div>
          {
      loggedIn ?
        this.renderCommentForm(message, newCommentIdx) :
        null
      }
        </div>
        <div>
          {this.renderComments()}
        </div>
      </div>
    )
  }
}
