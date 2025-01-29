require('dotenv').config()  // Due to this line now it is referring the PORT number from .env file
const express = require('express')
const app = express()
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/twitter', (req, res) => {
    res.send('Hello World!')
})
app.get('/login', (req, res) => {
    res.send('Hello World!')
})
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port:${process.env.PORT}`)
})

// free platforms to deplaoy