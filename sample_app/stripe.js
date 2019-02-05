const fetch = require('node-fetch')

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const stripeApiKey = process.env.STRIPE_API_KEY

const stripe = require("stripe")(stripeApiKey);

// User defined params.
const region = 'us-east-1' // specify region
const receiptBucket = 'buildsage' // Your custom bucket.

const PORT = 3004;

(async () => {
    try {
        // 1. Create the stripe payment
        const stripeResponse = await stripe.charges.create({
            amount: 100,
            currency: "usd",
            source: "tok_amex", // obtained with Stripe.js
            metadata: { 'order_id': '6735' }
        });
        const receiptUrl = stripeResponse.receipt_url
        const receiptId = stripeResponse.id

        // 2. Download the receipt (as bytes) for the transaction from the stripe response.
        const receiptResponse = await fetch(receiptUrl)
        const receiptData = await receiptResponse.text()

        const body = {
            accessKeyId,
            secretAccessKey,
            region,
            bucket: receiptBucket, // Your custom bucket name
            key: receiptId + "-stripe.html",
            data: receiptData
        }
        
        // 3. Upload the receipt bytes to s3.
        const uploadResponse = await fetch(`http://localhost:${PORT}/upload`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })

        // Print the response result.
        const result = await uploadResponse.text()
        console.log('upload result', result, 'file', body.key)
    } catch (e) {
        console.error('error', e)
    }
})()