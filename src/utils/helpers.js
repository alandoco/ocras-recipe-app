const request = require('request')

exports.checkIfValidUpdate = (updates, allowedUpdates) => {
    return updates.every((update) => allowedUpdates.includes(update))
}

exports.downloadImageFromURL = (imageUrl) => {
    return new Promise( (resolve, reject) => {
        request({uri: imageUrl, encoding: null }, (err, res, body) => {
            if(err){
                return reject(err)
            }
        
            return resolve(body)
        })
    })
}  