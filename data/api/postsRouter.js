const router = require('express').Router()

const DB = require('../db.js')

// 1 POST - /api/posts
router.post('/', (req, res) => {
  const postInfo = req.body

  if (!postInfo.title || !postInfo.contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for the post.' })
  } else {
    DB.insert(postInfo)
      .then(post => {
        res.status(201).json({ post })
      })
      .catch(err => {
        res.status(500).json({
          error: 'There was an error while saving the post to the database',
        })
      })
  }
})

// 2 POST - /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
  const newComment = req.body
  DB.insertComment(newComment)
    .then(comment => {
      !newComment
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : res.status(201).json({ comment })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: 'There was an error while saving the comment to the database',
      })
    })
})
// router.post('/:id/comments', (req, res) => {
//   const comment = req.body

//   if (
//     comment.post_id === undefined ||
//     comment.post_id === null ||
//     !comment.post_id ||
//     comment.post_id === {}
//   ) {
//     res
//       .status(404)
//       .json({ message: 'The post with the specified ID does not exist.' })
//   } else if (!comment.text) {
//     res
//       .status(400)
//       .json({ errorMessage: 'Please provide text for the comment.' })
//   } else {
//     DB.insertComment(comment)
//       .then(result => {
//         res.status(201).json(result)
//       })
//       .catch(err => {
//         res.status(500).json({
//           error: 'There was an error while saving the comment to the database',
//         })
//       })
//   }
// })

// 3 GET - /api/posts
router.get('/', (req, res) => {
  DB.find(res.query)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' })
    })
})

// 4 GET - /api/posts/:id
router.get('/:id', (req, res) => {
  const { id } = req.params

  if (id === null || id === {} || !id || id === req.body.id) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else {
    DB.findById(id)
      .then(posts => {
        res.status(200).json(posts)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: 'The post information could not be retrieved.' })
      })
  }
})

// 5 - GET - /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const { id } = req.params
  let idDoesExist = false

  DB.findById(id).then(post =>
    post.length !== 0 ? (idDoesExist = true) : null
  )

  DB.findPostComments(id)
    .then(comments => {
      if (idDoesExist) {
        res.status(200).json(comments)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })
})

// 6 - DELETE - /api/posts/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params

  if (id === null || id === {} || !id || id === req.body.id) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else {
    DB.remove(id)
      .then(() => {
        res.status(200).json({ message: 'The post was deleted.' })
      })
      .catch(error => {
        res.status(500).json({ error: 'The post could not be removed.' })
      })
  }
})

// 7 - PUT - /api/posts/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  const body = req.body

  if (id === null || id === {} || !id || id === body.id) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  } else {
    DB.update(id, body)
      .then(updatePost => {
        res.status(200).json(body)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: 'The post information could not be modified.' })
      })
  }
})

module.exports = router
