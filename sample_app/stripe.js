/*
 * MESG3 is designed as a backend utility that you can integrate into your existing workflows with AWS.
 * 
 * This application demonstrates an example of processing a transaction via the STRIPE API,
 * and using the MESG3 service to upload the completed receipt to AWS automatically.
 */

const fetch = require('node-fetch')

const accessKeyId = process.env.AWS_ACCESS_TEST
const secretAccessKey = process.env.AWS_SECRET_TEST
const stripeApiKey = process.env.STRIPE_API_KEY

const stripe = require("stripe")(stripeApiKey);

// User defined params.
const region = 'us-east-1' 
const bucket = 'liteflow-receipts'

const PORT = 3004;

(async () => {
    try {
        console.log('Creating payment')
        // 1. Create the stripe payment
        const stripeResponse = await stripe.charges.create({
            amount: 100,
            currency: "usd",
            source: "tok_amex", // obtained with Stripe.js
            metadata: { 'order_id': '6735' }
        });
        const receiptUrl = stripeResponse.receipt_url
        const receiptId = stripeResponse.id
        const key = `${receiptId}.html`

        // 2. Download the receipt (as bytes) for the transaction from the stripe response.
        const receiptResponse = await fetch(receiptUrl)
        const data = await receiptResponse.text()

        const body = {
            accessKeyId,
            secretAccessKey,
            region,
            data,
            bucket,
            key
        }
        
        console.log('Payment Finished')
        // 3. Upload the receipt bytes to s3 using the MESG3 service.
        const uploadResponse = await fetch(`http://localhost:${PORT}/upload`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })

        const result = await uploadResponse.text()
        const resultPayload = { result, bucket, upload: key }
        console.log(resultPayload)
    } catch (e) {
        console.error('error', e)
    }
})()