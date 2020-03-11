const express = require('express')
const cors = require('cors')
const PORT = 5555

const postsRouter = require('./data/api/postsRouter.js')

const server = express()

server.use(express.json())
server.use(cors())

server.get('/', (req, res) => {
	res.status(200).json({ server: 'is running' })
})

server.use('/api/posts', postsRouter)

server.listen(PORT, () => {
	console.log(`\n === Server is running on http://localhost:${PORT} === \n`)
})
