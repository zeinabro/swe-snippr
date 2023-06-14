const route = require('express').Router()
const authorize = require('../middleware/authorize')
const { encrypt, decrypt } = require('../utils/encrypt')

// array to store snippets instead of a database
const snippets = []

/**
 * Note that the endpoints in this file are now using the authorize middleware
 * In order to access them, a valid jwt must be provided!
 */

/**
 * Create a snippet
 */
route.post('/', authorize, (req, res) => {
  const { language, code } = req.body

  // basic validation
  if (!language || !code) {
    return res
      .status(400)
      .json({ error: 'Language and code are required fields' })
  }

  const snippet = {
    id: snippets.length + 1,
    language,
    code
  }

  // overwrite code with encrypted before storing
  snippets.push({ ...snippet, code: encrypt(code) })

  // send back the unencrypted snippet
  res.status(201).json(snippet)
})

/**
 * Get all snippets
 */
route.get('/', authorize, (req, res) => {
  const { lang } = req.query

  // decrypt all snippets
  const decodedSnippets = snippets.map(snippet => ({
    ...snippet,
    code: decrypt(snippet.code)
  }))

  // handle query strings
  if (lang) {
    const filteredSnippets = decodedSnippets.filter(
      snippet => snippet.language.toLowerCase() === lang.toLowerCase()
    )
    return res.json(filteredSnippets)
  }

  res.json(decodedSnippets)
})

/**
 * Get one snippet
 */
route.get('/:id', authorize, (req, res) => {
  const snippetId = parseInt(req.params.id)
  const snippet = snippets.find(snippet => snippet.id === snippetId)

  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' })
  }

  // decrypt before sending back
  snippet.code = decrypt(snippet.code)
  res.json(snippet)
})

module.exports = route
