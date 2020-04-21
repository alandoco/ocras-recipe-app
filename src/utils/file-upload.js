const multer = require('multer')
const sharp = require('sharp')
const {FILE_SIZE_LIMIT} = require('../constants/index')

const upload = multer({
    limits: {
        fileSize: FILE_SIZE_LIMIT
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Invalid file format'))
        }

        cb(undefined, true)
    }
})

const convertImage = async (fileBuffer) => {
    console.log(fileBuffer)
    return await sharp(fileBuffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
}

module.exports = {upload, convertImage}