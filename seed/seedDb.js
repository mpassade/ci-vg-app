const mongoose = require('mongoose')
const Game = require('../routes/models/gameModel')
const gameSeed = require('./gameSeed.json')
require('dotenv').config()

const seedFunc = async () => {
    try {
        const data = await Game.create(gameSeed)
        console.log(`${data.length} records created`)
        await mongoose.disconnect()
        console.log('MongoDB Disconnected')
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, () => {
    mongoose.connection.db.dropDatabase()
}).then(() => {
    console.log('MongoDB Connected')
    seedFunc()
}).catch(err => {
    console.log(`MongoDB Error: ${err}`)
})