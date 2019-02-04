
// Load the SDK for JavaScript
const AWS = require('aws-sdk')


const updateConfig = (region, accessKeyId, secretAccessKey) => {
    const credentials = {
        accessKeyId,
        secretAccessKey
    }
    AWS.config.update({ region, credentials })
}

module.exports.listBuckets = async ({ region, accessKeyId, secretAccessKey }, { success, error }) => {
    try {
        updateConfig(region, accessKeyId, secretAccessKey)
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

        // Call S3 to list current buckets
        s3.listBuckets(function (err, data) {
            if (err) {
                console.log("Error", err)
                error({
                    code: e.code,
                    message: e.toString()
                })
            } else {
                console.log("Bucket List", data.Buckets)
                success(data.Buckets)
            }
        })
    }
    catch (e) {
        error({
            code: e.code,
            message: e.toString()
        })
    }
}

module.exports.listObjects = async ({ region, accessKeyId, secretAccessKey, bucket }, { success, error }) => {
    try {
        updateConfig(region, accessKeyId, secretAccessKey)
        const s3 = new AWS.S3({ params: { Bucket: bucket }, apiVersion: '2006-03-01' })
        s3.listObjects(function (err, data) {
            if (err) {
                console.log("Error", err)
                error({
                    code: e.code,
                    message: e.toString()
                })
            } else {
                console.log("Object List", data.Contents)
                success(data.Contents)
            }
        })
    }
    catch (e) {
        error({
            code: e.code,
            message: e.toString()
        })
    }
}

module.exports.upload = async ({ region, accessKeyId, secretAccessKey, bucket, key, data }, { success, error }) => {
    try {
        updateConfig(region, accessKeyId, secretAccessKey)
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
        const base64data = new Buffer(data, 'binary')
        s3.putObject({
            Bucket: bucket,
            Key: key,
            Body: base64data,
        }, function (resp) {
            console.log('Successfully uploaded package.')
            success({result: 'ok'})
        })
    }
    catch (e) {
        error({
            code: e.code,
            message: e.toString()
        })
    }
}


module.exports.download = async ({ region, accessKeyId, secretAccessKey, bucket, key }, { success, error }) => {
    try {
        updateConfig(region, accessKeyId, secretAccessKey)
        const s3 = new AWS.S3({ params: { Bucket: bucket }, apiVersion: '2006-03-01' })
        const objParams = { Key: key }
        console.log('objParams', objParams)
        const data = await s3.getObject(objParams).promise();
        const dataString = data.Body.toString('utf-8');
        console.log('dataString', dataString)
        success(dataString)
    }
    catch (e) {
        error({
            code: e.code,
            message: e.toString()
        })
    }
}