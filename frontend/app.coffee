###
Module dependencies.
###

express = require 'express'

app = module.exports = express.createServer()

mongoose = require 'mongoose'
connectionManager = require './libs/connectionManager.coffee'
connectionManager = new connectionManager.connectionManager()

###
Configuration
###

app.configure -> 
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'ejs'
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use express.cookieParser()
	app.use express.session { secret: 'y75sd4f5gh7jkhuygft' }
	app.use app.router
	app.use express.static __dirname + '/public'

app.configure 'development', ->
	app.use express.errorHandler { dumpExceptions: true, showStack: true }
	mongoose.connect 'mongodb://localhost:27017/nodeirc'


app.configure 'production', ->
	app.use express.errorHandler
	mongoose.connect 'mongodb://localhost:27017/nodeirc'


###
Routes
###

app.get '/', (req,res) ->
	res.render 'index', {title: 'Express'}


###
Only listen on $ node app.js
###

if !module.parent
	app.listen 3000
	console.log "Express server listening on port %d", app.address().port
