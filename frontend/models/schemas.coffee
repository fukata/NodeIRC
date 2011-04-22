mongoose = require 'mongoose'

Schema = mongoose.Schema

# Server
Server = new Schema {
    host: String,
    port: Number,
    ssl: Boolean,
    password: String
}
mongoose.model('Server', Server)

# register model
schemas = {}
schemas.Server = mongoose.model('Server')

# exports
module.exports = schemas
