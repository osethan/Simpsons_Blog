var getMySql = require('../common/db').getMySql

var host = process.env.HOST

var characters = [
  {
    name: 'Homer Simpson',
    blurb: 'The father, who is overweight, lazy and works at a nuclear power plant and likes doughnuts',
    tvShow: 'Simpsons'
  },
  {
    name: 'Marge Simpson',
    blurb: 'The mother and housewife, who is very tolerant and understanding of her family',
    tvShow: 'Simpsons'
  },
  {
    name: 'Bart Simpson',
    blurb: 'The 10-year old son, who gets in trouble',
    tvShow: 'Simpsons'
  },
  {
    name: 'Lisa Simpson',
    blurb: 'The 8-year old daughter, who is very smart',
    tvShow: 'Simpsons'
  },
  {
    name: 'Maggie Simpson',
    blurb: 'The baby girl, who can not talk and is always doing mischief',
    tvShow: 'Simpsons'
  },
  {
    name: 'Philip Fry',
    blurb: 'Protagonist delivery boy from the 20th century',
    tvShow: 'Futurama'
  },
  {
    name: 'Turanga Leela',
    blurb: 'Captain of the Planet Express ship, and love interest of Fry',
    tvShow: 'Futurama'
  },
  {
    name: 'Bender Rodriguez',
    blurb: 'A kleptomaniacal, lazy, cigar-smoking, heavy-drinking robot who is Fry\'s best friend',
    tvShow: 'Futurama'
  },
  {
    name: 'Amy Wong',
    blurb: 'Intern at Planet Express and student of Mars University',
    tvShow: 'Futurama'
  },
  {
    name: 'Hermes Conrad',
    blurb: 'Bureaucrat and accountant of Planet Express',
    tvShow: 'Futurama'
  },
  {
    name: 'Prof. Hubert Farnsworth',
    blurb: 'CEO and owner of Planet Express delivery company and tenured professor of Mars University',
    tvShow: 'Futurama'
  },
  {
    name: 'Dr. John Zoidberg',
    blurb: 'Planet Express staff doctor and steward with a medical degree and a Ph.D in art history',
    tvShow: 'Futurama'
  }
]

getMySql(host, function(err, conn) {
  if (err) {
    console.log('Connection error. Exiting...')
    process.exit(1)
  }

  const tableName = 'characters'
  let query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (id TINYINT(2) NOT NULL, name TINYTEXT NOT NULL, blurb TEXT NOT NULL, tvShow TINYTEXT NOT NULL, PRIMARY KEY (id))'

  conn.query(query, function(err) {
    if (err) {
      console.log('Table creation error. Exiting...')
      process.exit(1)
    }

    query = 'TRUNCATE TABLE ' + tableName

    conn.query(query, function(err) {
      if (err) {
        console.log('Table clean error. Exiting...')
        process.exit(1)
      }

      let values = ''

      characters.forEach(function(character, index, array) {
        if (array.length - 1 === index) {
          values += '(' + (index + 1) + ', "' + character.name + '", "' + character.blurb + '", "' + character.tvShow + '")'
        } else {
          values += '(' + (index + 1) + ', "' + character.name + '", "' + character.blurb + '", "' + character.tvShow + '"),'
        }
      })

      query = 'INSERT INTO ' + tableName + '(id, name, blurb, tvShow) VALUES ' + values

      conn.query(query, function(err) {
        if (err) {
          console.log('Table insertion error. Exiting...')
          process.exit(1)
        }

        conn.end(function(err) {
          if (err) {
            console.log('Closing connection error. Exiting...')
            process.exit(1)
          }
        })
      })
    })
  })
})
