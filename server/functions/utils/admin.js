const admin = require('firebase-admin')

//initialize app
admin.initializeApp()

const db = admin.firestore()

module.exports = {admin, db}