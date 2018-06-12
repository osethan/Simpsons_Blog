var mysql = require('mysql')

exports.getMySql = function(host, cb) {
  var dbHost

  if (host) {
    if (host === 'localhost') {
      dbHost = host
    } else {
      console.log('Unrecognized host. Exiting...')
      process.exit(1)
    }
  } else {
    dbHost = 'mysql'
  }

  var dbName = process.env.MYSQL_DATABASE || 'blog'
  var password = process.env.MYSQL_ROOT_PASSWORD

  console.log('host:', dbHost)
  console.log('password:', password)
  console.log('database:', dbName)

  var conn = mysql.createConnection({
    host: dbHost,
    // host: 'localhost',
    port: 3306,
    user: 'root',
    password: password,
    database: dbName
  })

  conn.connect(function(err) {
    cb(err, conn)
  })
}
