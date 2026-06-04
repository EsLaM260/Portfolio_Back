const mongoose = require('mongoose')

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
}, { _id: false })

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  filter: { type: String, required: true },
  image: { type: String, required: true },       // full URL
  images: { type: [String], default: [] },        // array of full URLs
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  technologies: { type: [technologySchema], default: [] },
  useCases: { type: [String], default: [] },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  githubDisplay: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
