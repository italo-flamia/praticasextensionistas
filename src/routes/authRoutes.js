const {registro, login} = require ('../controllers/authController.js')

const router = require('express').Router()
router.post('/registro', registro)
router.post('/login', login)

module.exports = router
