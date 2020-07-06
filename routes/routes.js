const express = require('express')
const router = express.Router()
const passport = require('passport')
const {
    validateRegistrationInput, validateLoginInput,
    passwordCheck, duplicateAccountCheck, adminSecretCheck,
    validateAddGameInput, duplicateGameCheck
} = require('./middleware/middleware')
const {
    getLoginPg, getRegisterPg, register, allGames, logout, singleGame,
    addFavorite, removeFavorite, favorites, getAddGamePg, addGame,
    deleteGame
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

router.get('/game/:title', singleGame)

router.get('/add-favorite/:title', addFavorite)

router.get('/remove-favorite/:title', removeFavorite)

router.get('/favorites', favorites)

router.get('/add-game', getAddGamePg)

router.post(
    '/add-game', 
    validateAddGameInput, 
    duplicateGameCheck,
    addGame
)

router.get('/delete-game/:title', deleteGame)

module.exports = router