const express = require('express')
const bodyParser = require('body-parser')
const MESG = require('mesg-js').service()
const fetch = require('node-fetch')
const multer  = require('multer')
const FormData = require('form-data')

const { listBuckets, upload, download } = require('./tasks')

MESG.listenTask({
  listBuckets, upload, download
})

const PORT = 3002

const app = express()
app.use(bodyParser.json())

app.post('/list', async (req, res) => {
  const body = req.body
  const success = (data) => {
    return res.status(200).send({buckets: data})
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  listBuckets(body, {success, error})
})

app.post('/upload', async (req, res) => {
  const body = req.body
  const success = (data) => {
    return res.status(200).send('ok')
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  upload(body, {success, error})
})

app.post('/download', async (req, res) => {
  const body = req.body
  const success = (data) => {
    return res.status(200).send(data)
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  download(body, {success, error})
})

app.listen(PORT, () => console.log(`AWS S3 (MESG3) server started app listening on port ${PORT}!`))
