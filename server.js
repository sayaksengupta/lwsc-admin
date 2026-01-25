const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files
app.use(express.static(path.join(__dirname, 'build')))

// Dynamic config for environment variables
app.get('/config.js', (req, res) => {
  const config = {
    REACT_APP_BACKEND_API: process.env.REACT_APP_BACKEND_API || 'http://localhost:5000',
    REACT_APP_IMAGE_BASE_URL: process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5000/uploads/'
  }
  res.header('Content-Type', 'application/javascript')
  res.send(`window._env_ = ${JSON.stringify(config)};`)
})

// React routing fix
app.get('/*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Admin app running on port ${PORT}`)
})
