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
    },

    singleGame: (req, res) => {
        if (req.isAuthenticated()){
            Game.findOne({title: req.params.title}).then(game => {
                if (game){
                    res.locals.singleGame = game
                } else {
                    return res.redirect('/api/v1/vg-app/all-games')
                }
                return res.render('main/single-game')
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/login')
        }
    },

    addFavorite: (req, res) => {
        if (req.isAuthenticated()){
            Game.findOne({title: req.params.title})
            .then(game => {
                User.findOne({username: req.user.username})
                .then(user => {
                    user.favorites.push(game.title)
                    user.save()
                    .then(() => {
                        return res.redirect(`/api/v1/vg-app/game/${game.title}`)
                    }).catch(() => {
                    return res.status(400).send('Server Error')
                    })
                }).catch(() => {
                    return res.status(400).send('Server Error')
                })
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/login')
        }
    },

    removeFavorite: (req, res) => {
        if (req.isAuthenticated()){
            Game.findOne({title: req.params.title})
            .then(game => {
                User.findOne({username: req.user.username})
                .then(user => {
                    let arr = [...user.favorites]
                    for (let i=0; i<arr.length; i++){
                        if (arr[i]===game.title){
                            user.favorites.splice(i, 1)
                        }
                    }
                    user.save()
                    .then(() => {
                        return res.redirect(`/api/v1/vg-app/game/${game.title}`)
                    }).catch(() => {
                    return res.status(400).send('Server Error')
                    })
                }).catch(() => {
                    return res.status(400).send('Server Error')
                })
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/login')
        }
    },

    favorites: (req, res) => {
        if (req.isAuthenticated()){
            Game.find().then(games => {
                if (games.length){
                    res.locals.games = games
                }
                return res.render('main/favorites')
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/login')
        }
        
    },

    getAddGamePg: (req, res) => {
        if (req.isAuthenticated() && req.user.admin){
            return res.render('main/add-game')
        } else {
            return res.redirect('/api/v1/vg-app/all-games')
        }
    },

    addGame: (req, res) => {
        const newGame = new Game()
        newGame.title = req.body.title
        newGame.description = req.body.description
        newGame.yearReleased = req.body.year
        newGame.playtime = req.body.playtime
        newGame.image = req.body.image

        newGame.save().then(() => {
            return res.redirect('/api/v1/vg-app/all-games')
        }).catch((err) => {
            return res.status(400).send('Server Error: ' + err)
        })
    },

    deleteGame: (req, res) => {
        if (req.isAuthenticated() && req.user.admin){
            Game
            .findOne({title: req.params.title})
            .then(game => {
                if (game === null){
                    return res.redirect('/api/v1/vg-app/all-games')
                }
                Game
                .deleteOne(game)
                .then(() => {
                    User.find()
                    .then(users => {
                        let ppl = [...users]
                        for (let i=0; i<ppl.length; i++){
                            for (let j=0; j<ppl[i].favorites.length; j++){
                                if (ppl[i].favorites[j]===game.title){
                                    users[i].favorites.splice(j, 1)
                                    users[i].save()
                                    .then(() => {
                                    }).catch(() => {
                                        return res.status(400).send('Server Error')
                                    })
                                }
                            }
                        }
                        return res.redirect('/api/v1/vg-app/all-games')
                    })
                }).catch(() => {
                    return res.status(400).send('Server Error')
                })
            }).catch(() => {
                return res.status(400).send('Server Error')
            })
        } else {
            return res.redirect('/api/v1/vg-app/all-games')
        }
    }
}