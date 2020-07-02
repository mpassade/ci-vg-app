const User = require('../models/userModel')
const Game = require('../models/gameModel')
const bcrypt = require('bcryptjs')

module.exports = {
    getLoginPg: (req, res) => {
        return res.render('main/login')
    },

    getRegisterPg: (req, res) => {
        return res.render('main/register')
    },

    register: (req, res) => {
        const newUser = new User()
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        newUser.name = req.body.name
        newUser.email = req.body.email
        newUser.username = req.body.username
        newUser.password = hash

        if (req.body.adminSecret === process.env.ADMIN_SECRET){
            newUser.admin = true
        }

        newUser.save().then(user => {
            req.login(user, (err) => {
                if (err){
                    return res.status(400).send('Server Error')
                }
                return res.redirect('/api/v1/vg-app/all-games')
            })
        }).catch(() => {
            return res.status(400).send('Server Error')
        })
    },

    allGames: (req, res) => {
        if (req.isAuthenticated()){
            Game.find().then(games => {
                if (games.length){
                    res.locals.games = games
                }
                return res.render('main/all-games')
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/login')
        }
        
    },

    logout: (req, res) => {
        req.logout()
        req.session.destroy()
        res.redirect('/api/v1/vg-app/login')
    }
}