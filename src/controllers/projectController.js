const Project = require('../models/Project')
const getBaseUrl = require('../config/url')

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req)
    const projects = await Project.find().sort({ id: 1 }).select('-__v -_id -createdAt -updatedAt')
    
    // Convert image filenames back to full URLs
    const projectsWithUrls = projects.map(project => {
      const projectObj = project.toObject()
      return {
        ...projectObj,
        image: `${baseUrl}/uploads/${projectObj.image}`,
        images: projectObj.images.map(img => `${baseUrl}/uploads/${img}`),
      }
    })
    
    res.status(200).json({
      success: true,
      count: projectsWithUrls.length,
      data: projectsWithUrls,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/projects  (multipart/form-data)
const addProject = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req)

    // ── Images ──────────────────────────────────────────────────────────────
    // req.files comes from multer .fields([{name:'image'},{name:'images'}])

    if (!req.files || !req.files['image'] || req.files['image'].length === 0) {
      return res.status(400).json({ success: false, message: 'A main cover image is required.' })
    }

    // Main cover image → stored as filename only
    const mainImageFilename = req.files['image'][0].filename

    // Gallery images → stored as an array of filenames only
    const galleryImageFilenames = req.files['images']
      ? req.files['images'].map((f) => f.filename)
      : []

    // The `images` array always starts with the main image, matching the
    // original frontend format where images[0] === image (the hero shot)
    const allImages = [mainImageFilename, ...galleryImageFilenames]

    // ── Text fields ──────────────────────────────────────────────────────────
    // technologies and useCases arrive as JSON strings in multipart form-data
    let technologies = []
    let useCases = []

    try {
      technologies = req.body.technologies ? JSON.parse(req.body.technologies) : []
    } catch {
      return res.status(400).json({ success: false, message: 'technologies must be a valid JSON array string.' })
    }

    try {
      useCases = req.body.useCases ? JSON.parse(req.body.useCases) : []
    } catch {
      return res.status(400).json({ success: false, message: 'useCases must be a valid JSON array string.' })
    }

    const { id, title, category, filter, description, longDescription, liveUrl, githubUrl, githubDisplay } = req.body

    // Auto-increment id if not provided
    let projectId = id ? Number(id) : null
    if (!projectId) {
      const last = await Project.findOne().sort({ id: -1 })
      projectId = last ? last.id + 1 : 1
    }

    const project = await Project.create({
      id: projectId,
      title,
      category,
      filter,
      image: mainImageUrl,
      images: allImages,
      description,
      longDescription,
      technologies,
      useCases,
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      githubDisplay: githubDisplay === 'true' || githubDisplay === true,
    })

    const result = project.toObject()
    delete result.__v
    delete result._id
    delete result.createdAt
    delete result.updatedAt

    // Build full URLs for response
    result.image = `${baseUrl}/uploads/${result.image}`
    result.images = result.images.map(img => `${baseUrl}/uploads/${img}`)

    return res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: `A project with id ${req.body.id} already exists.` })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getProjects, addProject }
