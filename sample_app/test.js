const fetch = require('node-fetch')
const fs = require('fs')

// https://pay.stripe.com/receipts/acct_1032D82eZvKYlo2C/ch_1DyHJ42eZvKYlo2CLMjQjvbf/rcpt_ER9ceIpeeJP3NvWxz8Aa5qY15N1v6H2

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const region = 'us-east-1'

const resource = process.argv[2] // one of (buckets, objects, upload, download)
if (!resource) {
    console.log('USAGE:  node test.js <resource>')
    return
}

const body = {
    accessKeyId,
    secretAccessKey,
    region,
}

if (resource === 'upload') {
    const bucket = process.argv[3]
    const fileName = process.argv[4]
    if (!bucket || !fileName) {
        console.log('USAGE:  node test.js upload <bucket> <fileName>')
        return 
    }
    body.bucket = bucket
    body.key = fileName
    body.data = fs.readFileSync(fileName)
} else if (resource === 'download') {
    const bucket = process.argv[3]
    const fileName = process.argv[4]
    if (!bucket || !fileName) {
        console.log('USAGE:  node test.js download <bucket> <fileName>')
        return 
    }
    body.bucket = bucket
    body.key = fileName
} else if (resource === 'objects') {
    const bucket = process.argv[3] 
    if (!bucket) {
        console.log('USAGE:  node test.js objects <bucket>')
        return 
    }
    body.bucket = bucket
}

const PORT = 3003

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

