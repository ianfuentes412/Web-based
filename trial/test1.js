const express = require('express')
const app = express()
const bodyParser = require('body-parser')  // For a query with POST, PUT, DELETE
const port = 8014;  // Use your port number.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// For CORS


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// A GET method route with '/'
app.get('/', (req, res) => {
  res.send('GET: Hello World!')  // send(): combination of write() and end()
})

// A POST method route with '/'
app.post('/', (req, res) => {
  res.write('POST: Hello World!')
  res.end()
})

// A GET method route with '/users/'; what is a router here?
app.get('/users', (req, res) => {
  res.send('GET: username=' + req.query.username + "; password=" + req.query.password)
})

// A POST method route with '/users'
app.post('/users', (req, res) => {
  res.send('POST: username=' + req.body.username + "; password=" + req.body.password)
})