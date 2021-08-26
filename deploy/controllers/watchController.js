const router = require('express').Router()
const { Watch } = require('../models')



router.get('/watchlist', (req, res) => {
  Watch.find({})
    .then(watches => {
      let watchlist = {}
      watches.forEach(watch => {
        watchlist[watch.name] = watch.key
      })
      res.json(watchlist)
    })
    .catch(err => res.json(err))
})

router.post('/watch', (req, res) => {
  Watch.create({
    name: req.body.name,
    key: req.body.key
  })
    .then(watch => res.json({
      status: 200,
      message: `Successfully added ${req.body.name} to the watchlist`,
      result: watch
    }))
    .catch(err => res.json({
      status: 400,
      message: `Unable to add ${req.body.name} to the watchlist`,
      error: err
    }))
})

router.delete('/removeByKey/:key', (req, res) => {
  Watch.remove({ key: req.params.key })
    .then(deleted => {
      if (deleted.deletedCount) {
        res.json({
          status: 200,
          message: `[${req.params.key}] was successfully removed from the watchlist`
        })
      }
      else {
        res.json({
          status: 400,
          message: `[${req.params.key}] was not in watchlist. Unable to remove.`
        })
      }
    })
    .catch(err => res.json(err))
})

router.delete('/removeByName/:name', (req, res) => {
  Watch.remove({ name: req.params.name })
    .then(deleted => {
      if (deleted.deletedCount) {
        res.json({
          status: 200,
          message: `[${req.params.name}] was successfully removed from the watchlist`
        })
      }
      else {
        res.json({
          status: 400,
          message: `[${req.params.name}] was not in watchlist. Unable to remove.`
        })
      }
    })
    .catch(err => res.json(err))
})




module.exports = router