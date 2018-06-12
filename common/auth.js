import crypto from 'crypto'

const getSalt = () => {
  const length = 36
  const salt = crypto.randomBytes(length)
    .toString('hex')
    .slice(length)

  return salt
}

const getHash = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
    .update(password)
    .digest('hex')

  return hash
}

export default {
  getSalt,
  getHash
}
