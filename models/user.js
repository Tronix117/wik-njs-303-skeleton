const db = require('sqlite')

module.exports = {
  get: (userId) => {
    return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
  },

  count: () => {
    return db.get('SELECT COUNT(*) as count FROM users')
  },

  getAll: (limit, offset) => {
    return db.all('SELECT rowid, * FROM users LIMIT ? OFFSET ?', limit, offset)
  },

  insert: (params) => {
    return db.run(
      'INSERT INTO users (pseudo, email, firstname, createdAt) VALUES (?, ?, ?, ?)',
      params.pseudo,
      params.email,
      params.firstname,
      Date.now()
    )
  },

  update: (userId, params) => {
    const POSSIBLE_KEYS = [ 'pseudo', 'email', 'firstname' ]

    let dbArgs = []
    let queryArgs = []

    for (key in params) {
      if (-1 === POSSIBLE_KEYS.indexOf(key)) {
        queryArgs.push(`${key} = ?`)
        dbArgs.push(params[key])
      }
    }

    // queryArgs.push('updatedAt = ?')
    // dbArgs.push(Date.now())

    if (!queryArgs.length) {
      let err = new Error('Bad request')
      err.status = 400
      return Promise.reject(err)
    }

    dbArgs.push(userId)

    let query = 'UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?'

    //db.run.apply(db, query, dbArgs)
    return db.run(db, dbArgs)
  },

  remove: (userId) => {
    return db.run('DELETE FROM users WHERE rowid = ?', userId)
  }
}
