const mongoose = require('mongoose')
const moment = require('moment')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 3
    },
    timestamp: {
        type: String,
        default: () => {
            return moment().format('dddd, MMMM Do YYYY, h:mm a')
        }
    },
    admin: {
        type: Boolean,
        default: false
    },
    favorites: [String]
})

module.exports = mongoose.model('user', UserSchema)