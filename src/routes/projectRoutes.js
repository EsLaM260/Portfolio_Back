const express = require('express')
const router = express.Router()
const { projectUpload } = require('../middleware/upload')
const { getProjects, addProject } = require('../controllers/projectController')

router.get('/', getProjects)
router.post('/', projectUpload, addProject)

module.exports = router
