# MESG3
---

## Inspiration
Many folks want to take advantage of blockchain, but don't know where to begin. With MESGBox, users can easily integrate their applications with Amazon S3 using this simple MESG service to upload and query files.

## What it does
Creates an easy connector for querying and storing information as part of a larger MESG workflow.

## Dev Notes
```bash
mesg-core service deploy https://github.com/cbonoz/mesg19
```

### Events
// TODO

### Tasks
`See mesg.yml`


## Example Application
* Issue and receive a payment via https://github.com/mesg-foundation/service-stripe
* Upload a receipt to Amazon S3 via MESG3 (this repo).

### How to setup example
* Deploy and start the services
<pre>
    mesg-core start
    mesg-core service deploy https://github.com/cbonoz/mesg19
    mesg-core service deploy https://github.com/mesg-foundation/service-stripe
    mesg-core service start https://github.com/mesg-foundation/service-stripe
    mesg-core service start https://github.com/cbonoz/mesg19
<pre>
* Define the following environment TEST (or production) credentials:
<pre>
    AWS_ACCESS_TEST=<YOUR_AWS_ACCESS_KEY_HERE>
    AWS_SECRET_TEST=<YOUR_AWS_SECRET_KEY_HERE>
    STRIPE_API_KEY=<YOUR_STRIPE_API_KEY>
</pre>
* Call the stripe test workflow.
<pre>
    node sample_app/stripe.js
</pre>
