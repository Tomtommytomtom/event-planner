const express = require('express')
const serveStatic = require('serve-static')

const app = express()
app.use(serveStatic(__dirname + '/dist'))

let port = process.env.PORT || 8080
app.listen(port)
