const multer = require('multer')
const sharp = require('sharp')
const AWS = require('aws-sdk');
const request = require('request')
const { v4: uuidv4 } = require('uuid');
const {FILE_SIZE_LIMIT} = require('./constants')

const upload = multer({
    limits: {
        fileSize: FILE_SIZE_LIMIT
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)){
            return cb(new Error('Invalid file format'))
        }

        cb(undefined, true)
    }
})

const convertImage = async (fileBuffer) => {
    return await sharp(fileBuffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
}

const downloadImageFromURL = (imageUrl) => {
    return new Promise( (resolve, reject) => {
        request({uri: imageUrl, encoding: null }, (err, res, body) => {
            if(err){
                return reject(err)
            }
        
            return resolve(body)
        })
    })
}  

const s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    Bucket: process.env.AWS_BUCKET_NAME,
    signatureVersion: 'v4',
    region: 'us-east-2'
})


const uploadToS3 = async (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uuidv4() + '_' + file.originalname,
        Body: file.buffer,
    }

    const upload = s3bucket.upload(params)
    const promise = upload.promise()
    const uploadResult = promise.then((data) => {return {data}}, (err) => {return {err}})    

    return uploadResult
}

const downloadFromS3 = async (filename) => {
    const urlParams = {Bucket: process.env.AWS_BUCKET_NAME, Key: filename}

    return s3bucket.getSignedUrl('getObject', urlParams)
}

module.exports = {upload, convertImage, uploadToS3, downloadFromS3, downloadImageFromURL}