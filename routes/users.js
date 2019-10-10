const router = require('express').Router()
const User = require('../models/user')

/* Users : liste */
router.get('/', function(req, res, next) {
  let limit = parseInt(req.query.limit) || 20
  let offset = parseInt(req.query.offset) || 0
  if (limit > 100) limit = 100

  Promise.all([
    User.getAll(limit, offset),
    User.count()
  ]).then((results) => {
    res.format({
      html: () => {
        res.render('users/index', {
          title: 'Gestion d\'utilisateurs',
          users: results[0],
          count: results[1].count,
          limit: limit,
          offset: offset
        })
      },
      json: () => {
        res.send({
          data: results[0],
          meta: {
            count: results[1].count
          }
        })
      }
    })
  }).catch(next)
})

router.post('/', (req, res, next) => {
  if (
    !req.body.pseudo || req.body.pseudo === '' ||
    !req.body.email || req.body.email === '' ||
    !req.body.firstname || req.body.firstname === ''
  ) {
    let err = new Error('Bad Request')
    err.status = 400
    return next(err)
  }

  User.insert(req.body).then(() => {
    res.format({
      html: () => { res.redirect('/users') },
      json: () => { res.status(201).send({message: 'success'}) }
    })
  }).catch(next)
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('users/edit', {
        title: 'Ajouter un utilisateur',
        user: {},
        action: '/users'
      })
    },
    json: () => {
      let error = new Error('Bad Request')
      error.status = 400
      next(error)
    }
  })
})

router.get('/:userId(\\d+)/edit', function(req, res, next) {
  User.get(req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => {
        res.render('users/edit', {
          title: 'Éditer un utilisateur',
          user: user,
          action: `/users/${user.rowid}?_method=put`
        })
      },
      json: () => {
        let error = new Error('Bad Request')
        error.status = 400
        next(error)
      }
    })
  }).catch(next)
})

router.get('/:userId(\\d+)', (req, res, next) => {
  User.get(req.params.userId).then((user) => {
    if (!user) return next()

    res.format({
      html: () => { res.render('users/show', { user, title: `Utilisateur : ${user.pseudo}` }) },
      json: () => { res.send({ data: user }) }
    })
  }).catch(next)
})

router.put('/:userId(\\d+)', (req, res, next) => {
  User.update(req.params.userId, req.body).then(() => {
    res.format({
      html: () => { res.redirect(`/users/${req.params.userId}`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

router.delete('/:userId(\\d+)', (req, res, next) => {
  User.remove(req.params.userId).then(() => {
    res.format({
      html: () => { res.redirect(`/users`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

module.exports = router

























///
