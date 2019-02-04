const fetch = require('node-fetch')

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
    bucket: 'buildsage',
    key: 'service-worker.js'
}

const mesg = require('mesg-js').application()

const PORT = 3003

fetch(`http://localhost:${PORT}/${resource}`, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(console.error)

