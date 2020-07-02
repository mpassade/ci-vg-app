const mongoose = require('mongoose')
const moment = require('moment')

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    yearReleased: {
        type: Number,
        trim: true,
        required: true
    },
    playtime: {
        type: Number,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    timestamp: {
        type: String,
        default: () => {
            return moment().format('dddd, MMMM Do YYYY, h:mm a')
        }
    }
})

module.exports = mongoose.model('game', GameSchema)