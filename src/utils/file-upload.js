const multer = require('multer')
const sharp = require('sharp')
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const {FILE_SIZE_LIMIT} = require('../utils/constants')

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

const uploadToS3 = async (file) => {
    const s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
        Bucket: process.env.AWS_BUCKET_NAME,
    })
    
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

module.exports = {upload, convertImage, uploadToS3}