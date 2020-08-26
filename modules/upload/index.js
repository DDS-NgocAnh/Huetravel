const fs = require('fs')
const path = require('path')

const handlers = {
    async uploadCKFinder(req, res, next) {
        try {
            const file = req.files.upload

            file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
                if(err) {
                    console.log(err);
                }
            })
            
            const targetPathUrl = `../../../public/uploads/${file.name}`

            if(path.extname(file.name).toLowerCase() === '.png' || '.jpg' || '.jpeg') {
                res.json({
                    uploaded: true,
                    url: `${targetPathUrl}`
                })
                
                if(err) {
                    next(err)
                }
            }
            
        } catch (error) {
            next(error)
        }
    },

    async uploadPhoto (req, res, next) {
        try {
            if(req.files === null) {
                res.json({"message": "No file upload"})
            }

            const file = req.files.file            
            file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
                if(err) {
                    console.log(err);
                }
                
                res.json({ 
                    filePath: `../../../public/uploads/${file.name}`
                })
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = handlers 