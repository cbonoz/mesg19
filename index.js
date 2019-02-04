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
  const success = (s3Object) => {
    const stream = s3Object.createReadStream()
      // forward errors
    stream.on('error', function error(err) {
        //continue to the next middlewares
        return next();
    });

    //Add the content type to the response (it's not propagated from the S3 SDK)
    res.set('Content-Type', mime.lookup(key));
    res.set('Content-Length', data.ContentLength);
    res.set('Last-Modified', data.LastModified);
    res.set('ETag', data.ETag);

    stream.on('end', () => {
        console.log('Served by Amazon S3: ' + key);
    });
    //Pipe the s3 object to the response
    stream.pipe(res);
  }
  const error = (err) => {
    return res.status(500).send(err.toString())
  }

  download(body, {success, error})
})

const PORT = 3003
app.listen(PORT, () => console.log(`AWS S3 (MESG3) server started app listening on port ${PORT}!`))
