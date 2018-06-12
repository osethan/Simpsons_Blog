import express from 'express'
import redis from 'redis'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectRedis from 'connect-redis'
import moment from 'moment-timezone'
import fs from 'fs'

import { getMySql } from '../common/db'
import auth from '../common/auth'

const app = express()
const port = 3030
const host = ''
const redisClient = redis.createClient({
  host: 'redis',
  // host: 'localhost',
  port: 6379
})
const RedisStore = connectRedis(session)

getMySql(host, (err, conn) => {
  if (err) {
    console.log(err)

    console.log('Database connection error. Exiting...')
    process.exit(1)
  }

  app.use(bodyParser.json())
  app.use(session({
    secret: auth.getSalt(),
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      ttl: 1000 * 60 * 60
    }),
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  }))
  app.use((req, res, next) => {
    const frontendUrl = 'http://localhost:3000'

    res.header('Access-Control-Allow-Origin', frontendUrl)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials', true)
    next()
  })

  app.get('/simpsons', (req, res) => {
    const query = 'SELECT name, blurb FROM characters WHERE tvShow="Simpsons"'

    conn.query(query, (err, results) => {
      if (err) {
        console.log('Database read error. Exiting...')
        process.exit(1)
      }

      const simpsons = results.map((result) => {
        return {
          name: result.name,
          blurb: result.blurb
        }
      })

      res.json(simpsons)
    })
  })

  app.get('/futurama', (req, res) => {
    const query = 'SELECT name, blurb FROM characters WHERE tvShow="Futurama"'

    conn.query(query, (err, results) => {
      if (err) {
        console.log('Database read error. Exiting...')
        process.exit(1)
      }

      const futurama = results.map((result) => {
        return {
          name: result.name,
          blurb: result.blurb
        }
      })

      res.json(futurama)
    })
  })

  app.get('/creator', (req, res) => {
    fs.readFile('./data/creator.json', 'utf8', (err, content) => {
      if (err) {
        console.log('File read error. Exiting...')
        process.exit(1)
      }

      const creator = JSON.parse(content)
      const texts = creator.texts

      res.json(texts)
    })
  })

  app.post('/comments/create', (req, res) => {
    const id = req.body.id
    const username = req.body.username
    const comment = req.body.comment
    const isoTime = req.body.isoTime
    const parentId = req.body.parentId
    const query = `INSERT INTO comments (id, username, comment, isoTime, parentId) values ("${id}", "${username}", "${comment}", "${isoTime}", "${parentId}")`

    conn.query(query, (err) => {
      if (err) {
        console.log('Database insertion error. Exiting...')
        process.exit(1)
      }

      res.end()
    })
  })

  app.get('/comments/read', (req, res) => {
    const query = 'SELECT * FROM comments ORDER BY isoTime ASC'

    conn.query(query, (err, results) => {
      if (err) {
        console.log('Database read error. Exiting...')
        process.exit(1)
      }

      let comments = {}

      results.forEach((result) => {
        const timestamp = moment(result.isoTime).tz(moment.tz.guess()).format('dddd, MMM Do YYYY, h:mm:ssA z')
        const comment = {
          id: result.id,
          username: result.username,
          comment: result.comment,
          isoTime: result.isoTime,
          timestamp: timestamp,
          parentId: result.parentId,
          children: []
        }
        let key

        if (result.parentId === '') {
          key = result.id

          if (!comments[key]) {
            comments[key] = comment
          } else {
            const children = comments[key].children

            comments[key] = comment
            comments[key].children = children
          }
        } else {
          key = result.parentId

          if (comments[key]) {
            comments[key].children.push(comment)
          } else {
            comments[key] = {
              children: [comment]
            }
          }
        }
      })
      comments = Object.values(comments).reverse()

      res.json(comments)
    })
  })

  app.post('/comments/update', (req, res) => {
    const id = req.body.id
    const comment = req.body.comment
    const query = `UPDATE comments SET comment="${comment}" WHERE id="${id}"`

    conn.query(query, (err) => {
      if (err) {
        console.log('Database update error. Exiting...')
        process.exit(1)
      }

      res.end()
    })
  })

  app.post('/comments/delete', (req, res) => {
    const id = req.body.id
    const query = `DELETE FROM comments WHERE id="${id}" OR parentId="${id}"`

    conn.query(query, (err) => {
      if (err) {
        console.log('Database deletion error. Exiting...')
        process.exit(1)
      }

      res.end()
    })
  })

  app.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let query = `SELECT username FROM users WHERE username="${username}"`

    conn.query(query, (err, results) => {
      if (err) {
        console.log('Database read error. Exiting...')
        process.exit(1)
      }

      if (results.length === 0) {
        const salt = auth.getSalt()
        const hash = auth.getHash(password, salt)
        query = `INSERT INTO users (username, salt, hash) VALUES ("${username}", "${salt}", "${hash}")`

        conn.query(query, (err) => {
          if (err) {
            console.log('Database insertion error. Exiting...')
            process.exit(1)
          }

          req.session.key = username
          res.json({
            user: {
              username: req.session.key
            }
          })
        })
      } else {
        res.json({
          message: 'Username already taken'
        })
      }
    })
  })

  app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let query = `SELECT username, salt, hash FROM users WHERE username="${username}"`

    conn.query(query, (err, results) => {
      if (err) {
        console.log('Database read error. Exiting...')
        process.exit(1)
      }

      if (results.length === 1) {
        const salt = results[0].salt
        const hash = results[0].hash

        if (hash === auth.getHash(password, salt)) {
          req.session.key = username
          res.json({
            user: {
              username: req.session.key
            }
          })
        } else {
          res.json({
            message: 'Invalid credentials'
          })
        }
      } else {
        res.json({
          message: 'Invalid credentials'
        })
      }
    })
  })

  app.get('/logout', (req, res) => {
    const key = req.session.key

    if (key) {
      req.session.destroy(() => {
        res.end()
      })
    } else {
      res.end()
    }
  })

  app.listen(port, () => {
    console.log('Application server live...')
  })
})
