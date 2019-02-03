const fetch = require('node-fetch')

// https://pay.stripe.com/receipts/acct_1032D82eZvKYlo2C/ch_1DyHJ42eZvKYlo2CLMjQjvbf/rcpt_ER9ceIpeeJP3NvWxz8Aa5qY15N1v6H2

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const region = 'us-east-1'

const body = {
    accessKeyId,
    secretAccessKey,
    region
}

fetch('localhost:3002', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json))

