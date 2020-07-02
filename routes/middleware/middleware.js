const User = require('../models/userModel')

module.exports = {
    validateRegistrationInput: (req, res, next) => {
        const {name, username, email, password} = req.body
        if (!name || !username || !email || !password){
            req.flash('errors', 'Name, Email, Username, and Password fields are required')
            return res.redirect('/api/v1/vg-app/register')
        }
        next()
    },

    validateLoginInput: (req, res, next) => {
        const {username, password} = req.body
        if (!username || !password){
            req.flash('errors', 'All fields are required')
            return res.redirect('/api/v1/vg-app/login')
        }
        next()
    },

    passwordCheck: (req, res, next) => {
        if(req.body.password.length < 3){
            req.flash('errors', 'Password must be at least 3 characters')
            return res.redirect('/api/v1/vg-app/register')
        }
        next()
    },

    duplicateAccountCheck: (req, res, next) => {
        const {email, username} = req.body
        User.findOne({email}).then(user => {
            if(user){
                req.flash('errors', 'An account with that email address already exists')
                return res.redirect('/api/v1/vg-app/register')
            }
            User.findOne({username}).then(user => {
                if(user){
                    req.flash('errors', 'An account with that username already exists')
                    return res.redirect('/api/v1/vg-app/register')
                }
                next()
            }).catch(() => res.status(400).send('Server Error'))
        }).catch(() => res.status(400).send('Server Error'))
    },

    adminSecretCheck: (req, res, next) => {
        const {adminSecret} = req.body
        if (adminSecret && adminSecret!==process.env.ADMIN_SECRET){
            req.flash('errors', 'Incorrect admin secret. If you are not authorized to be an admin, leave that field blank.')
            return res.redirect('/api/v1/vg-app/register')
        }
        next()
    }
}