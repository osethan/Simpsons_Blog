var getMySql = require('../common/db').getMySql

var host = process.env.HOST

getMySql(host, function(err, conn) {
  if (err) {
    console.log('Connection error. Exiting...')
    process.exit(1)
  }

  var tableName = 'comments'
  var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (id varchar(32) NOT NULL, username varchar(16) NOT NULL, comment TEXT NOT NULL, isoTime TINYTEXT NOT NULL, parentId varchar(32) NOT NULL, PRIMARY KEY (id))'

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
