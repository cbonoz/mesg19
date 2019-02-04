const fetch = require('node-fetch')
const fs = require('fs')

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const region = 'us-east-1'

const body = {
    accessKeyId,
    secretAccessKey,
    region,
}

fetch(`http://localhost:${PORT}/${resource}`, {
    method: 'post',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
})
.then(res => {
    if (resource === 'download') {
        return res.text()
    }
    return res.json()
})
.then(json => console.log(json))
.catch(console.error)