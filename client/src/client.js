import axios from 'axios'

const backendUrl = 'http://localhost:3030'

const fetchSimpsons = () => {
  return axios.request({
    url: `${backendUrl}/simpsons`,
    method: 'get'
  })
    .then((res) => {
      const simpsons = res.data

      return simpsons
    })
}

const fetchFuturama = () => {
  return axios.request({
    url: `${backendUrl}/futurama`,
    method: 'get'
  })
    .then((res) => {
      const futurama = res.data

      return futurama
    })
}

const fetchCreator = () => {
  return axios.request({
    url: `${backendUrl}/creator`,
    method: 'get'
  })
    .then((res) => {
      const texts = res.data

      return texts
    })
}

const dispatchComment = (comment) => {
  return axios.request({
    url: `${backendUrl}/comments/create`,
    method: 'post',
    data: {
      id: comment.id,
      username: comment.username,
      comment: comment.comment,
      isoTime: comment.isoTime,
      parentId: comment.parentId
    },
    withCredentials: true
  })
}

const fetchComments = () => {
  return axios.request({
    url: `${backendUrl}/comments/read`,
    method: 'get'
  })
    .then((res) => {
      const comments = res.data

      return comments
    })
}

const dispatchCommentUpdate = (comment) => {
  return axios.request({
    url: `${backendUrl}/comments/update`,
    method: 'post',
    data: {
      id: comment.id,
      comment: comment.comment
    },
    withCredentials: true
  })
}

const dispatchCommentDelete = (id) => {
  return axios.request({
    url: `${backendUrl}/comments/delete`,
    method: 'post',
    data: {
      id: id
    },
    withCredentials: true
  })
}

const dispatchLogin = (username, password) => {
  return axios.request({
    url: `${backendUrl}/login`,
    method: 'post',
    data: {
      username: username,
      password: password
    },
    withCredentials: true
  })
    .then((res) => {
      const data = res.data

      return data
    })
}

const dispatchSignup = (username, password) => {
  return axios.request({
    url: `${backendUrl}/signup`,
    method: 'post',
    data: {
      username: username,
      password: password
    },
    withCredentials: true
  })
    .then((res) => {
      const data = res.data

      return data
    })
}

const dispatchLogout = () => {
  return axios.request({
    url: `${backendUrl}/logout`,
    method: 'get',
    withCredentials: true
  })
}

export default {
  fetchSimpsons,
  fetchFuturama,
  fetchCreator,
  dispatchComment,
  fetchComments,
  dispatchCommentUpdate,
  dispatchCommentDelete,
  dispatchLogin,
  dispatchSignup,
  dispatchLogout
}
