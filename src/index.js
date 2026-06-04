require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const projectRoutes = require('./routes/projectRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded images as static files → http://localhost:5000/uploads/filename.png
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/projects', projectRoutes)

// Health check
app.get('/', (req, res) => res.json({ message: 'Portfolio API is running.' }))

// Multer error handler (file type / size violations)
app.use((err, req, res, next) => {
  if (err.name === 'MulterError' || err.message.includes('Only image files')) {
    return res.status(400).json({ success: false, message: err.message })
  }
  next(err)
})

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
