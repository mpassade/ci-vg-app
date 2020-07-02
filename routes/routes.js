const express = require('express')
const router = express.Router()
const passport = require('passport')
const {
    validateRegistrationInput, validateLoginInput,
    passwordCheck, duplicateAccountCheck, adminSecretCheck
} = require('./middleware/middleware')
const {
    getLoginPg, getRegisterPg, register, allGames, logout
} = require('./controllers/controller')

router.get('/login', getLoginPg)

router.post(
    '/login',
    validateLoginInput,
    passport.authenticate('local-login', {
        successRedirect: '/api/v1/vg-app/all-games',
        failureRedirect: '/api/v1/vg-app/login',
        failureFlash: true
    }))

router.get('/register', getRegisterPg)

router.post(
    '/register',
    validateRegistrationInput,
    passwordCheck,
    duplicateAccountCheck,
    adminSecretCheck,
    register
)

router.get('/all-games', allGames)

router.get('/logout', logout)

module.exports = router