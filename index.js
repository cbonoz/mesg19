const express = require('express')
const bodyParser = require('body-parser')
const MESG = require('mesg-js').service()
const fetch = require('node-fetch')
const multer  = require('multer')
const FormData = require('form-data')

const { listBuckets, listObjects, upload, download } = require('./tasks')

MESG.listenTask({
  listBuckets, listObjects, upload, download
})

const app = express()
app.use(bodyParser.json())

app.post('/buckets', async (req, res) => {
  const body = req.body
  const success = (data) => {
    return res.status(200).send({buckets: data})
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  listBuckets(body, {success, error})
})

app.post('/objects', async (req, res) => {
  const body = req.body
  const success = (data) => {
    return res.status(200).send({objects: data})
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  listObjects(body, {success, error})
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

const PORT = 3003
app.listen(PORT, () => console.log(`AWS S3 (MESG3) server started app listening on port ${PORT}!`))
