const fetch = require('node-fetch')
const fs = require('fs')

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const stripeApiKey = process.env.STRIPE_API_KEY

const stripe = require("stripe")(stripeApiKey);

// User defined params
const region = 'us-east-1'
const receiptBucket = 'buildsage' // Your custom bucket.

const PORT = 3004;

(async () => {
    try {
        const stripeResponse = await stripe.charges.create({
            amount: 2000,
            currency: "usd",
            source: "tok_amex", // obtained with Stripe.js
            metadata: { 'order_id': '6735' }
        });
        const receiptUrl = stripeResponse.receipt_url
        const receiptId = stripeResponse.id
        // console.log('response', stripeResponse)

        const receiptResponse = await fetch(receiptUrl)
        const receiptData = await receiptResponse.text()
        // console.log('receiptData', receiptData)

        const body = {
            accessKeyId,
            secretAccessKey,
            region,
            bucket: receiptBucket, // Your custom bucket name
            key: receiptId + "-stripe.html",
            data: receiptData
        }
        
        const uploadResponse = await fetch(`http://localhost:${PORT}/upload`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await uploadResponse.text()
        console.log('upload result', result, 'file', body.key)
    } catch (e) {
        console.error('error', e)
    }
})()