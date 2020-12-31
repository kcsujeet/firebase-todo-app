const express = require('express')
const router = express.Router()
const auth = require('../utils/auth')


//import controllers
const userController = require('../controllers/userController')
router.get('/', auth, userController.getUser)
router.post('/login', userController.loginUser)
router.post('/signup', userController.signUpUser)
router.post('/image/upload', auth, userController.uploadProfilePhoto)
router.put('/update/:id', auth, userController.updateUser)
router.get('/:user_id/todos', auth, userController.getUserTodos)

module.exports =  router
