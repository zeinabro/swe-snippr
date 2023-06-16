const express = require('express')
const app = express()
const PORT = 5000

app.use(express.json())

// array to store snippets
const snippets = require('./seedData.json')

// generate a unique ID for each snippet
let id = snippets.length + 1

// create a new snippet
app.post('/snippet', (req, res) => {
  const { language, code } = req.body

  // basic validation
  if (!language || !code) {
    return res
      .status(400)
      .json({ error: 'Language and code are required fields' })
  }

  const snippet = {
    id: id++,
    language,
    code
  }

  snippets.push(snippet)
  res.status(201).json(snippet)
})

// get all snippets
app.get('/snippet', (req, res) => {
  const { lang } = req.query

  if (lang) {
    const filteredSnippets = snippets.filter(
      snippet => snippet.language.toLowerCase() === lang.toLowerCase()
    )
    return res.json(filteredSnippets)
  }

  res.json(snippets)
})

// get a snippet by ID
app.get('/snippet/:id', (req, res) => {
  const snippetId = parseInt(req.params.id)
  const snippet = snippets.find(snippet => snippet.id === snippetId)

  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' })
  }

  res.json(snippet)
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
