const express = require('express')
const router = express.Router()
const auth = require('../utils/auth')

//import controller
const todoController =  require('../controllers/todoController')

router.get('/all', todoController.getAllTodos)
router.post('/new', auth, todoController.addOneTodo)
router.put('/update/:id', auth, todoController.updateOneTodo)
router.delete('/delete/:id', auth, todoController.deleteOneTodo)
module.exports = router