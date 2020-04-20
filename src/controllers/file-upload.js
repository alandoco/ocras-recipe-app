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

const saveFile = async (user, fileBuffer) => {
    const buffer = await sharp(fileBuffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()

    user.avatar = buffer
    await user.save()
}

module.exports = {upload, saveFile}