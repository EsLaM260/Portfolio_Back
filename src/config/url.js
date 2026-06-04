/**
 * Returns the base URL of the server.
 * Priority:
 *   1. APP_URL from .env  (used in production with a real domain)
 *   2. Derived from the incoming Express request (works for local dev automatically)
 *
 * Usage:
 *   const getBaseUrl = require('../config/url')
 *   const base = getBaseUrl(req)   // → "https://api.myportfolio.com"  or  "http://localhost:5000"
 */
const getBaseUrl = (req) => {
  if (process.env.APP_URL && process.env.APP_URL.trim() !== '') {
    return process.env.APP_URL.trim().replace(/\/$/, '') // strip trailing slash
  }
  return `${req.protocol}://${req.get('host')}`
}

module.exports = getBaseUrl
