require('dotenv').config() // bring in environment variables
const express = require('express')
const app = express()
const routes = require('./routes')
const PORT = 4000

app.use(express.json())

// apply the routes
app.use('/user', routes.user)
app.use('/snippet', routes.snippet)

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
