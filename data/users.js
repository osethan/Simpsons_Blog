var getMySql = require('../common/db').getMySql

var host = process.env.HOST

getMySql(host, function(err, conn) {
  if (err) {
    console.log(err)

    console.log('Connection error. Exiting...')
    process.exit(1)
  }

  var tableName = 'users'
  var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (id SMALLINT(5) NOT NULL AUTO_INCREMENT, username varchar(16) NOT NULL, salt TINYTEXT NOT NULL, hash TEXT NOT NULL, PRIMARY KEY (id))'

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

      conn.end(function(err) {
        if (err) {
          console.log('Closing connection error. Exiting...')
          process.exit(1)
        }
      })
    })
  })
})
